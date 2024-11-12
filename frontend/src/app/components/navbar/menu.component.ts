import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    CommonModule,
    RouterLink,
    RouterLinkActive
  ]
})
export class MenuComponent {
  constructor(
    private dialog: MatDialog,
    public loginService: LoginService,
    private router: Router
  ) {}

  openLoginDialog(): void {
    this.dialog.open(LoginComponent, {
      width: '400px',
      disableClose: false,
      autoFocus: true,
      backdropClass: 'backdrop-blur'
    });
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/home']);
  }
}