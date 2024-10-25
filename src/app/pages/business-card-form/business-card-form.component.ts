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
import { BusinessCardService } from '../../services/BusinessCard/business-card.service';
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

  businessCardForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private BusinessCardservice: BusinessCardService,
    private toastr: ToastrService
  ) {

    this.businessCardForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
    });
  }

  onClose() {
    this.onCloseModel.emit(false);
  }
  ngOnChanges(): void {
    if (this.data) {
      this.businessCardForm.patchValue({
        name: this.data.name,
        email: this.data.email,
        phone: this.data.phone,
        gender: this.data.gender,
        dateOfBirth: formatDate(this.data.dateOfBirth, 'yyyy-MM-ddTHH:mm:ssZ', 'en'),
        address: this.data.address,
      });
    }
  }

  onSubmit() {
    if (this.businessCardForm.valid) {

      debugger;
      if (this.data?.id) {
        this.BusinessCardservice
          .updateBusinessCard(this.data.id as string, this.businessCardForm.value)
          .subscribe({
            next: (response: any) => {
              this.resetBussineesCardForm();
              this.toastr.success(response.message);
            },
          });
      } else {
        debugger;
        const { newBusinessCard, postObservable } = this.BusinessCardservice.createBusinessCard(this.businessCardForm.value);

postObservable.subscribe({
  next: (response: any) => {
    this.resetBussineesCardForm();
    this.toastr.success(response?.message ?? 'Card Added Successfully!');
  },
  error: (error: any) => {
    this.toastr.error('Error while adding business card.');
  }
});



      }
    } else {
      this.businessCardForm.markAllAsTouched();
    }
  }

  resetBussineesCardForm() {
    this.businessCardForm.reset();
    this.onClose();
  }
}
