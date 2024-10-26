import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImportService } from '../../../../services/Files/Import/import.service';
import { BusinessCardService } from '../../../../services/BusinessCard/business-card.service';
import { MatIcon } from '@angular/material/icon';
import { ExportService } from '../../../../services/Files/Export/export.service';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,MatIcon]
})
export class QrCodeComponent {
  form: FormGroup;
  qrCodeImage: File | null = null;
  errorMessage: string | null = null;
  isViewMode: boolean = false

  constructor(
    private importService: ImportService,
    private fb: FormBuilder,
    private businessCardService: BusinessCardService,
    private  exportService: ExportService
  ) {
    this.form = this.fb.group({
      qrCode: [''],
    });

    this.isViewMode=this.businessCardService.isViewMode;
  }

  triggerFileInputClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileSelected(event: any) {
    debugger;
    const file: File = event.target.files[0];
    if (file) {
      this.qrCodeImage = file;
      this.decodeQrCode();
    }
  }

  // Decode the QR code by sending the image to the backend
  decodeQrCode() {
    debugger;

    if (!this.qrCodeImage) {
      this.errorMessage = 'Please select a valid QR code image.';
      return;
    }
    this.importService.decodeQrCode(this.qrCodeImage).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.businessCardService.currentBusinessCard = response.value;
          this.errorMessage = null;
        } else {
          this.errorMessage = response.error?.message || 'Failed to decode the QR code.';
        }
      },
      error: (err) => {
        this.errorMessage = 'An error occurred while decoding the QR code.';
        debugger;

      },
      complete: () => {
        console.log('QR code decoding process completed.');
      }
    });
  }


  generateAndDownloadQrCode(): void {
    let currentBusinessCard:IBusinessCard |null = this.businessCardService.currentBusinessCard;

    if (!currentBusinessCard || !currentBusinessCard.name) {
      console.log('Please provide a valid business card.');
      return;
    }
    this.exportService.generateAndDownloadQrCode(currentBusinessCard);
  }


}

