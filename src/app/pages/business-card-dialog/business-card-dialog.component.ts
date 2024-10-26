import {Component,EventEmitter,Input,OnChanges,Output,} from '@angular/core';
import {FormGroup,FormBuilder,FormControl,Validators,ReactiveFormsModule} from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BusinessCardService } from '../../services/BusinessCard/business-card.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { ImageUploadComponent } from "../shared/components/image-upload/image-upload.component";
@Component({
  selector: 'app-bussineesCard-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ImageUploadComponent],
  templateUrl: './business-card-dialog.component.html',
  styleUrl: './business-card-dialog.component.scss',
})
export class BusinessCardDialogComponent implements OnChanges {
  @Input() data: IBusinessCard | null = null;
  @Output() onCloseModel = new EventEmitter();

  businessCardDialogForm!: FormGroup;
  isViewMode: boolean = false
  currentCard:IBusinessCard |null = null

  constructor(
    private fb: FormBuilder,
    private businessCardservice: BusinessCardService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<BusinessCardDialogComponent>

  ) {
    this.isViewMode=this.businessCardservice.isViewMode;
    this.currentCard = this.businessCardservice.currentBusinessCard;

    this.businessCardDialogForm = this.fb.group({
      name: new FormControl(this.currentCard?.name || '', [Validators.required]),
      email: new FormControl(this.currentCard?.email || '', [Validators.required, Validators.email]),
      phone: new FormControl(this.currentCard?.phone || '', [Validators.required]),
      gender: new FormControl(this.currentCard?.gender || '', [Validators.required]),
      dateOfBirth: new FormControl(this.currentCard ? formatDate(this.currentCard.dateOfBirth, 'yyyy-MM-dd', 'en') : '', [Validators.required]),
      address: new FormControl(this.currentCard?.address || '', [Validators.required]),
      photo: new FormControl(this.currentCard?.photo || '')
    });

    if(this.isViewMode){
      this.disableFormControls();
    }
  }
  disableFormControls(): void {
    this.businessCardDialogForm.get('name')?.disable();
    this.businessCardDialogForm.get('email')?.disable();
    this.businessCardDialogForm.get('phone')?.disable();
    this.businessCardDialogForm.get('gender')?.disable();
    this.businessCardDialogForm.get('dateOfBirth')?.disable();
    this.businessCardDialogForm.get('address')?.disable();
    this.businessCardDialogForm.get('photo')?.disable();
  }


  onClose() {
    this.dialogRef.close();
   }

  ngOnChanges(): void {
 if (this.data) {
      this.businessCardDialogForm.patchValue({
        name: this.data.name,
        email: this.data.email,
        phone: this.data.phone,
        gender: this.data.gender,
        dateOfBirth: formatDate(this.data.dateOfBirth, 'yyyy-MM-ddTHH:mm:ssZ', 'en'),
        address: this.data.address,
      });
    }
  }

  onPhotoBase64Change(base64: string) {
    debugger;
    console.log(`onPhotoBase64Change() ${base64}`);
    this.businessCardDialogForm.get('photo')?.setValue(base64);
  }

  onSubmit() {
    if (this.businessCardDialogForm.valid) {

      debugger;
      if (this.data?.id) {
        this.businessCardservice
          .updateBusinessCard(this.data.id as string, this.businessCardDialogForm.value)
          .subscribe({
            next: (response: any) => {
              this.resetBussineesCardForm();
              this.toastr.success(response.message);
              this.dialogRef.close();
            },
          });
      } else {
const { newBusinessCard, postObservable } = this.businessCardservice.createBusinessCard(this.businessCardDialogForm.value);

postObservable.subscribe({
  next: (response: any) => {
    if (response?.isSuccess) {
      this.resetBussineesCardForm();
      this.toastr.success( "Card Added Successfully!");
      newBusinessCard.lastUpdateAt=(new Date()).toDateString();
      newBusinessCard.id=response?.value;
      this.dialogRef.close(newBusinessCard);
    }else {
      console.log('Error adding business card :=> '+response);
      this.resetBussineesCardForm();
      this.dialogRef.close();
    }

  },
  error: (err) => {
  console.log('Error adding business card : '+err);
  }
});
      }
    } else {
      this.businessCardDialogForm.markAllAsTouched();
    }
  }

  resetBussineesCardForm() {
    this.businessCardDialogForm.reset();
    this.dialogRef.close();
  }
}
