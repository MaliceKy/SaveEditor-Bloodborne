import { Component } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SignupComponent } from '../signup/signup.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  });

  isLoading = false;
  errorMessage = '';

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<SignupComponent>,
    private loginService: LoginService,
    private router: Router
  ) {}

  openSignupDialog() {
    this.dialogRef.close();
    this.dialog.open(SignupComponent, {
      width: '400px',
      disableClose: false,
      autoFocus: true,
      backdropClass: 'backdrop-blur'
    });
  }

  async login() {
    if (!this.loginForm.valid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const success = await this.loginService.login(
        this.loginForm.value.username.toLowerCase(),
        this.loginForm.value.password
      );

      if (success) {
        const hasUserRole = await this.loginService.hasRole('user');
        if (hasUserRole) {
          this.dialogRef.close();
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'User role not found.';
        }
      }
    } catch (error: any) {
      if (error.status === 401) {
        this.errorMessage = 'Invalid credentials. Please try again.';
      } else {
        this.errorMessage = 'An unexpected error occurred. Please try again later.';
      }
      console.error('Login error:', error);
    } finally {
      this.isLoading = false;
    }
  }
}