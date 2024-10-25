import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { IBusinessCard } from '../shared/models/BusinessCard';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BusinessCardservice } from '../../services/business-card.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-bussineesCard-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './business-card-form.component.html',
  styleUrl: './business-card-form.component.scss',
})
export class BussineesCardFormComponent implements OnChanges {
  @Input() data: IBusinessCard | null = null;
  @Output() onCloseModel = new EventEmitter();

  bussineesCardForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private BusinessCardservice: BusinessCardservice,
    private toastr: ToastrService
  ) {
    this.bussineesCardForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobile: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      doj: new FormControl('', [Validators.required]),
    });
  }

  onClose() {
    this.onCloseModel.emit(false);
  }

  ngOnChanges(): void {
    if (this.data) {
      this.bussineesCardForm.patchValue({
        name: this.data.name,
        email: this.data.email,
        mobile: this.data.phone,
        dob: formatDate(this.data.dob, 'yyyy-MM-dd', 'en'),
        address: this.data.address,
      });
    }
  }

  onSubmit() {
    if (this.bussineesCardForm.valid) {
      if (this.data) {
        this.BusinessCardservice
          .updateBusinessCard(this.data.id as string, this.bussineesCardForm.value)
          .subscribe({
            next: (response: any) => {
              this.resetBussineesCardForm();
              this.toastr.success(response.message);
            },
          });
      } else {
        this.BusinessCardservice.createBusinessCard(this.bussineesCardForm.value).subscribe({
          next: (response: any) => {
            this.resetBussineesCardForm();
            this.toastr.success(response.message);
          },
        });
      }
    } else {
      this.bussineesCardForm.markAllAsTouched();
    }
  }

  resetBussineesCardForm() {
    this.bussineesCardForm.reset();
    this.onClose();
  }
}
