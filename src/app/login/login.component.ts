import { Component } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  
  constructor(private dialog: MatDialog,
  private dialogRef: MatDialogRef<LoginComponent>
  ) {}

  openSignupDialog() {
    this.dialogRef.close();
    this.dialog.open(SignupComponent, {
    });
  }
}