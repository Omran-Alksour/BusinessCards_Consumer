import {Component,EventEmitter,Input,OnChanges,OnInit,Output,} from '@angular/core';
import {FormGroup,FormBuilder,FormControl,Validators,ReactiveFormsModule} from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BusinessCardService } from '../../services/BusinessCard/business-card.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { ImageUploadComponent } from "../shared/components/image-upload/image-upload.component";
import { QrCodeComponent } from '../shared/components/qr-code/qr-code.component';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-bussineesCard-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ImageUploadComponent,QrCodeComponent],
  templateUrl: './business-card-dialog.component.html',
  styleUrl: './business-card-dialog.component.scss',
})
export class BusinessCardDialogComponent implements OnChanges, OnInit  {
  @Input() data: IBusinessCard | null = null;
  @Output() onCloseModel = new EventEmitter();

  businessCardDialogForm!: FormGroup;
  isViewMode: boolean = false
  currentCard:IBusinessCard |null = null
  subscription!: Subscription;


  constructor(
    private fb: FormBuilder,
    private businessCardService: BusinessCardService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<BusinessCardDialogComponent>

  ) {
    this.isViewMode=this.businessCardService.isViewMode;
    this.currentCard = this.businessCardService.currentBusinessCard;

    this.businessCardDialogForm = this.fb.group({
      name: new FormControl(this.currentCard?.name || '', [Validators.required]),
      email: new FormControl(this.currentCard?.email || '', [Validators.required, Validators.email]),
      phoneNumber: new FormControl(this.currentCard?.phoneNumber || '', [Validators.required]),
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
    this.businessCardDialogForm.get('phoneNumber')?.disable();
    this.businessCardDialogForm.get('gender')?.disable();
    this.businessCardDialogForm.get('dateOfBirth')?.disable();
    this.businessCardDialogForm.get('address')?.disable();
    this.businessCardDialogForm.get('photo')?.disable();
  }
//update from QR Code

ngOnInit() {
  // Subscribe to changes in the currentBusinessCard
  this.subscription = this.businessCardService.currentBusinessCard$.subscribe(card => {
    if (card) {
      debugger;
      this.businessCardDialogForm.patchValue({
        name: card.name,
        email: card.email,
        phoneNumber: card.phoneNumber,
        address: card.address,
        gender: card.gender,
        dateOfBirth:formatDate(card.dateOfBirth, 'yyyy-MM-dd', 'en'),
        photo: card.photo
      });
    }
  });
}



  onClose() {
    this.dialogRef.close();
   }

  ngOnChanges(): void {
    debugger;
 if (this.data) {
      this.businessCardDialogForm.patchValue({
        name: this.data.name,
        email: this.data.email,
        phoneNumber: this.data.phoneNumber,
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
        this.businessCardService
          .updateBusinessCard(this.data.id as string, this.businessCardDialogForm.value)
          .subscribe({
            next: (response: any) => {
              this.resetBussineesCardForm();
              this.toastr.success(response.message);
              this.dialogRef.close();
            },
          });
      } else {
const { newBusinessCard, postObservable } = this.businessCardService.createBusinessCard(this.businessCardDialogForm.value);

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


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
