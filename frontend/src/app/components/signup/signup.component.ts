import { Component } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator, PasswordStrengthValidator } from './password-validators';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm: FormGroup = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [PasswordStrengthValidator]),
    password2: new FormControl(null, [Validators.required, passwordMatchValidator()]),
  });

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<SignupComponent>,
    private loginService: LoginService,
    private router: Router
  ) {}

  openSigninDialog() {
    this.dialogRef.close();
    this.dialog.open(LoginComponent);
  }

  async signup() {
    if (!this.signupForm.valid) {
      return;
    }
    
    try {
      const success = await this.loginService.register(
        this.signupForm.value.username,
        this.signupForm.value.password
      );
      
      if (success) {
        this.dialogRef.close();
        // Navigation is handled in the login service
      }
    } catch (error) {
      console.error('Registration error:', error);
      // You might want to add error handling UI here
    }
  }
}
