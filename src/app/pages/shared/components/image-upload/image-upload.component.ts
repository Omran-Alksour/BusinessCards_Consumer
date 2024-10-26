import { Component, Output, EventEmitter, Input, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BusinessCardService } from '../../../../services/BusinessCard/business-card.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  imports: [CommonModule, FormsModule, MatIconModule]
})
export class ImageUploadComponent {


  @Input() base64Value: string | null = null;
  @Output() photo = new EventEmitter<string>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  fileError: string | null = null;
  previewUrl: string | undefined = 'assets/images/default_image.png';
  isViewMode: boolean = false

  constructor(private businessCardService: BusinessCardService) {
    this.isViewMode=businessCardService.isViewMode;
    if(this.isViewMode && this.previewUrl){
      this.previewUrl =businessCardService.currentBusinessCard?.photo;
    }
  }


  onFileSelected(event: any) {
    const file = event.target?.files?.[0];
    if (file) {
      this.processFile(file);
    }
  }


  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.processFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }


  processFile(file: File) {
debugger;
    if (file.size > 1 * 1024 * 1024) {
      this.fileError = 'File size cannot exceed 1MB';
      this.previewUrl = undefined;
      this.photo.emit('');
    } else {
      this.fileError = null;
      this.previewFile(file);
      this.convertToBase64(file);
    }
  }


  previewFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }


  convertToBase64(file: File) {
    this.businessCardService.convertToBase64(file).subscribe({
      next: (response: any) => {
        let result = response?.base64Image;

        if (result?.isSuccess) {
          this.photo.emit(result?.value);
        } else {
          this.fileError = result?.error?.message || 'Error converting image to Base64';
        }
      },
      error: () => {
        this.fileError = 'Error connecting to the server.';
      }
    });
  }

  base46Changed($event: Event) {
    let inputValue = ($event.target as HTMLInputElement).value.trim();

    if (!inputValue.startsWith("data:image/")) {
      inputValue = `data:image/png;base64,${inputValue}`;
      ($event.target as HTMLInputElement).value = inputValue;
    }
    this.photo.emit(inputValue);
    this.previewUrl = inputValue;
  }



}
