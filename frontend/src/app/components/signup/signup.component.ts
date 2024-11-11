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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm: FormGroup = new FormGroup({
    username: new FormControl(null, [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')
    ]),
    password: new FormControl(null, [PasswordStrengthValidator]),
    password2: new FormControl(null, [Validators.required, passwordMatchValidator()]),
  });

  isLoading = false;

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<SignupComponent>,
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
    
    this.isLoading = true;
    
    try {
      const success = await this.loginService.register(
        this.signupForm.value.username.toLowerCase(),
        this.signupForm.value.password
      );
      
      if (success) {
        this.dialogRef.close();
      }
    } catch (error: any) {
      if (error?.error?.error === "User already exists") {
        this.signupForm.get('username')?.setErrors({ 
          duplicateEmail: 'This email is already registered' 
        });
      } else {
        console.error('Registration error:', error);
      }
    } finally {
      this.isLoading = false;
    }
  }
}
