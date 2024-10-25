import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-business-card-dialog',
  templateUrl: './business-card-dialog.component.html',
  styleUrls: ['./business-card-dialog.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, ReactiveFormsModule
  ]
})
export class BusinessCardDialogComponent {
  businessCardForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BusinessCardDialogComponent>
  ) {
    this.businessCardForm = this.fb.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  submit() {
    if (this.businessCardForm.valid) {
      this.dialogRef.close(this.businessCardForm.value);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
