import { Component } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  constructor(private dialog: MatDialog,
  private dialogRef: MatDialogRef<SignupComponent>
  ) {}

  openSigninDialog() {
    this.dialogRef.close();
    this.dialog.open(LoginComponent, {
    });
  }

}
