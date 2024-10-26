import { Component, OnInit } from '@angular/core';
import * as Papa from 'papaparse';
import { CommonModule } from '@angular/common';
import { ModelComponent } from '../shared/ui/model/model.component';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { ImportService } from '../../services/Files/Import/import.service';

@Component({
  selector: 'app-file-import',
  standalone: true,
  imports: [CommonModule, ModelComponent, RouterLink, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './file-import.component.html',
  styleUrls: ['./file-import.component.scss']
})
export class FileImportComponent implements OnInit {
  fileContent: IBusinessCard[] | null = null;
  selectedFile: File | null = null;
  isLoading: boolean = false;

  private readonly sessionStorageKey = 'businessCards';
  private readonly fileStorageKey = 'selectedFile';

  constructor(private importService: ImportService,private toastr: ToastrService) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent): void {}

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.onFileSelect({ target: { files: files } });
    }
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileContent = null;
      this.isLoading = true;

      const fileExtension = this.getFileExtension(file.name);

      if (fileExtension === 'csv') {
        this.parseCsvFile(file);
      } else if (fileExtension === 'xml') {
        this.parseXmlFile(file);
      } else {
        this.toastr.error('Unsupported file format. Please select a CSV or XML file.');
        this.isLoading = false;
      }

      this.saveFileToSessionStorage(file);
    }
  }

  getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  parseCsvFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = reader.result as string;
      const parsedResult = Papa.parse(text, {
        delimiter: '',
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          this.fileContent = this.parseCsvToBusinessCards(result.data);
          this.isLoading = false;
          this.saveToSessionStorage();
        },
        error: (err: any) => {
          this.toastr.error('Error parsing CSV file.');
          console.error('Error parsing CSV:', err);
          this.isLoading = false;
        }
      });
    };
    reader.readAsText(file);
  }

  parseXmlFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const xmlData = reader.result as string;
        this.fileContent = this.parseXmlToBusinessCards(xmlData);
        this.isLoading = false;
        this.saveToSessionStorage();
      } catch (error) {
        this.toastr.error('Error parsing XML file.');
        console.error('Error parsing XML:', error);
        this.isLoading = false;
      }
    };
    reader.onerror = () => {
      this.toastr.error('Error reading file.');
      console.error('Error reading file');
      this.isLoading = false;
    };
    reader.readAsText(file);
  }

  parseCsvToBusinessCards(data: any[]): IBusinessCard[] {
    return data.map((row: any) => {
      const normalizedRow = this.normalizeRowKeysToPascalCase(row);

      return {
        name: normalizedRow['Name'] || '',
        gender: parseInt(normalizedRow['Gender'], 10) || 0,
        email: normalizedRow['Email'] || '',
        phone: normalizedRow['PhoneNumber'] || '',//|| normalizedRow['Phone']
        dateOfBirth: normalizedRow['DateOfBirth'] || '',
        address: normalizedRow['Address'] || '',
        photo: normalizedRow['Photo'] || 'assets/images/default_image.png',
        lastUpdateAt: new Date().toISOString()
      } as IBusinessCard;
    });
  }

  normalizeRowKeysToPascalCase(row: any): any {
    const normalizedRow: any = {};
    for (const key in row) {
      if (row.hasOwnProperty(key)) {
        const pascalKey = this.toPascalCase(key);
        normalizedRow[pascalKey] = row[key];
      }
    }
    return normalizedRow;
  }

  toPascalCase(str: string): string {
    return str
      .replace(/(?:^|_)(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
      .replace(/(?:^|\.)(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
  }

  parseXmlToBusinessCards(xmlData: string): IBusinessCard[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, 'application/xml');

    const parserError = xmlDoc.getElementsByTagName('parsererror');
    if (parserError.length > 0) {
      throw new Error('Error parsing XML: ' + parserError[0].textContent);
    }

    const businessCards: IBusinessCard[] = [];
    const cardNodes = xmlDoc.getElementsByTagName('BusinessCard');

    for (let i = 0; i < cardNodes.length; i++) {
      const card = cardNodes[i];
      debugger;
      let photo =card.getElementsByTagName('Photo')[0]?.textContent;
      let photo2 =card.getElementsByTagName('Photo')[0]?.textContent;

      businessCards.push({
        name: card.getElementsByTagName('Name')[0]?.textContent || '',
        gender: parseInt(card.getElementsByTagName('Gender')[0]?.textContent || '0', 10),
        email: card.getElementsByTagName('Email')[0]?.textContent || '',
        phone: card.getElementsByTagName('PhoneNumber')[0]?.textContent || '',
        dateOfBirth: card.getElementsByTagName('DateOfBirth')[0]?.textContent || '',
        address: card.getElementsByTagName('Address')[0]?.textContent || '',
        photo: card.getElementsByTagName('Photo')[0]?.textContent || 'assets/images/default_image.png',
        lastUpdateAt: new Date().toISOString()
      });
    }

    return businessCards;
  }

  onUpload(): void {
    if (this.selectedFile) {
      this.importService.importBusinessCards(this.selectedFile).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.toastr.success(`Successfully imported ${response.value.success.length} business cards.`);
            if (response.value.failed.length > 0) {
              this.toastr.warning(`${response.value.failed.length} business cards failed to import.`);
            }
          } else {
            this.toastr.error(response.error.message || 'Failed to import business cards.');
          }
        },
        error: (err) => {
          this.toastr.error('Error while uploading the file.');
          console.error('Upload error:', err);
        }
      });
    } else {
      this.toastr.error('Please select a file to upload.');
    }
  }

  saveToSessionStorage(): void {
    if (this.fileContent) {
      sessionStorage.setItem(this.sessionStorageKey, JSON.stringify(this.fileContent));
      console.log('Data saved to session storage');
    }
  }

  saveFileToSessionStorage(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const fileData = {
        name: file.name,
        type: file.type,
        content: reader.result as string // base64-encoded file content
      };
      sessionStorage.setItem(this.fileStorageKey, JSON.stringify(fileData));
    };
    reader.readAsDataURL(file);
  }

  ngOnInit(): void {
    const storedData = sessionStorage.getItem(this.sessionStorageKey);
    const storedFile = sessionStorage.getItem(this.fileStorageKey);

    if (storedData) {
      this.fileContent = JSON.parse(storedData);
      console.log('Loaded data from session storage');
    }

    if (storedFile) {
      const fileData = JSON.parse(storedFile);
      const byteString = atob(fileData.content.split(',')[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const intArray = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        intArray[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([arrayBuffer], { type: fileData.type });
      this.selectedFile = new File([blob], fileData.name, { type: fileData.type });

      console.log('Loaded file from session storage --> Name:', this.selectedFile.name);
    }
  }

  resetFile(): void {
    this.selectedFile = null;
    this.fileContent = null;
    this.isLoading = false;
    this.clearSessionStorage();
  }

  clearSessionStorage(): void {
    sessionStorage.removeItem(this.sessionStorageKey);
    sessionStorage.removeItem(this.fileStorageKey);
    console.log('Data removed from session storage');
  }
}
