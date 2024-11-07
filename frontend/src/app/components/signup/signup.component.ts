import { Component } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator, PasswordStrengthValidator } from './password-validators';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule,
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
    private dialogRef: MatDialogRef<SignupComponent>
  ) {}

  openSigninDialog() {
    this.dialogRef.close();
    this.dialog.open(LoginComponent, {
    });
  }

  signup() {
    if (!this.signupForm.valid) {
      return;
    }
    
    const signupData = {
      username: this.signupForm.value.username,
      password: this.signupForm.value.password
    };

    console.log('Signup data:', signupData);
  }

}
