import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../config';
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { UserLoginModel } from '../models/users.model';

interface TokenResponseObject {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private httpClient: HttpClient, private _router:Router) { 
    this.loggedIn.next(this.token.length > 0);
  }

  public get token(): string {
    return localStorage.getItem('token') || '';
  }

  public set token(value: string) {
    localStorage.setItem('token', value);
    this.loggedIn.next(value.length > 0);
  }

  public loggedIn: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  public async hasRole(role:string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.httpClient.get<UserLoginModel>(Config.apiBaseUrl + `/security/user`).subscribe({
        next: (response) => {
          if (response.roles)
            resolve(response.roles.indexOf(role) >= 0);
          else
            resolve(false);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  public async authorize(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.httpClient.get<TokenResponseObject>(Config.apiBaseUrl + '/security/authorize').subscribe({
        next: (response) => {
          this.token = response.token;
          resolve(response.token.length > 0);
        },
        error: (error) => {
          reject(error);
        }
      });
    }); 
  }

  public login(username: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.httpClient.post<TokenResponseObject>(Config.apiBaseUrl+"/security/login", { username: username, password: password }).subscribe({
        next: (response) => {
          if (response.token && response.token.length > 0) {
            this.token = response.token
            resolve(true);
          } else {
            this.token = "";
            resolve(false);
          }
        },
        error: (error) => {
          this.token="";
          console.error(error);
          reject(error);
        }
      });
    });
  }

  public logout(): void {
    this.token = '';
  }

  public async register(username: string, password: string): Promise<boolean> {
    try {
      const response = await this.httpClient.post<{token: string}>(
        `${Config.apiBaseUrl}/security/register`, 
        { username, password }
      ).toPromise();
      
      if (response && response.token) {
        this.token = `Bearer ${response.token}`;
        this.loggedIn.next(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  }
}
