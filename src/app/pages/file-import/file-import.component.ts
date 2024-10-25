import { Component, OnDestroy, OnInit } from '@angular/core';
import * as Papa from 'papaparse';
import { IBusinessCard } from '../shared/models/BusinessCard';
import { CommonModule } from '@angular/common';
import { ModelComponent } from '../shared/ui/model/model.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-file-import',
  standalone: true,
  imports: [CommonModule, ModelComponent,RouterLink],
  templateUrl: './file-import.component.html',
  styleUrls: ['./file-import.component.scss']
})
export class FileImportComponent implements OnInit, OnDestroy {
  fileContent: IBusinessCard[] | null = null;
  selectedFile: File | null = null;
  isLoading: boolean = false;
  private removeTimeout: any;

  // Store key for local storage
  private readonly localStorageKey = 'businessCards';

  // Handle file selection
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
        console.error('Unsupported file format.');
        this.isLoading = false;
      }
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
          this.saveToSessionStorage();  // Save parsed data to localStorage
        },
        error: (err: any) => {
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
        this.fileContent = this.parseXmlToBusinessCards(xmlData);  // Parse XML
        this.isLoading = false;
        this.saveToSessionStorage();  // Save parsed data to localStorage
      } catch (error) {
        console.error('Error parsing XML:', error);
        this.isLoading = false;
      }
    };
    reader.onerror = () => {
      console.error('Error reading file');
      this.isLoading = false;
    };
    reader.readAsText(file);
  }

  parseCsvToBusinessCards(data: any[]): IBusinessCard[] {
    return data.map((row: any) => {
      return {
        name: row['Name'],
        gender: parseInt(row['Gender'], 10),
        email: row['Email'],
        phone: row['PhoneNumber'],
        dateOfBirth: row['DateOfBirth'],
        address: row['Address'],
        photo: row['Photo'],
        lastUpdateAt: new Date().toISOString()
      } as IBusinessCard;
    });
  }

  parseXmlToBusinessCards(xmlData: string): IBusinessCard[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, 'application/xml');

    // Check if the XML was parsed correctly
    const parserError = xmlDoc.getElementsByTagName('parsererror');
    if (parserError.length > 0) {
      throw new Error('Error parsing XML: ' + parserError[0].textContent);
    }

    const businessCards: IBusinessCard[] = [];
    const cardNodes = xmlDoc.getElementsByTagName('BusinessCard');

    for (let i = 0; i < cardNodes.length; i++) {
      const card = cardNodes[i];
      businessCards.push({
        name: card.getElementsByTagName('Name')[0]?.textContent || '',
        gender: parseInt(card.getElementsByTagName('Gender')[0]?.textContent || '0', 10),
        email: card.getElementsByTagName('Email')[0]?.textContent || '',
        phone: card.getElementsByTagName('Phone')[0]?.textContent || '',
        dateOfBirth: card.getElementsByTagName('DateOfBirth')[0]?.textContent || '',
        address: card.getElementsByTagName('Address')[0]?.textContent || '',
        photo: card.getElementsByTagName('Photo')[0]?.textContent || undefined,
        lastUpdateAt: new Date().toISOString()
      });
    }

    return businessCards;
  }

  // Function to handle file upload
  onUpload(): void {
    if (this.selectedFile) {
      console.log('Uploading file:', this.selectedFile.name);
      console.log('Parsed Content:', this.fileContent);

      // Simulate an upload
      setTimeout(() => {
        console.log('File uploaded successfully!');
        this.clearSessionStorage();  // Clear localStorage after upload
      }, 1000);
    }
  }

// Save file content to sessionStorage
saveToSessionStorage(): void {
  if (this.fileContent) {
    sessionStorage.setItem(this.localStorageKey, JSON.stringify(this.fileContent));
    console.log('Data saved to sessionStorage');
  }
}



  // Load the list from localStorage when the component initializes
  ngOnInit(): void {
    const storedData = localStorage.getItem(this.localStorageKey);
    if (storedData) {
      this.fileContent = JSON.parse(storedData);
      console.log('Loaded data from localStorage');
    }
  }

  // Reset the file and preview, and clear localStorage
  resetFile(): void {
    this.selectedFile = null;
    this.fileContent = null;
    this.isLoading = false;
    this.clearSessionStorage();  // Clear localStorage when resetting
  }



  // If the user navigates back within 20 seconds, cancel the removal
  cancelRemoveTimeout(): void {
    if (this.removeTimeout) {
      clearTimeout(this.removeTimeout);
    }
  }

// Clear sessionStorage and clear the timeout when the data is removed
clearSessionStorage(): void {
  sessionStorage.removeItem(this.localStorageKey);
  console.log('Data removed from sessionStorage');

  // Clear the timeout if it's set
  if (this.removeTimeout) {
    clearTimeout(this.removeTimeout);
    this.removeTimeout = null; // Set it to null to avoid future unintended clearings
    console.log('Timeout cleared after removing data');
  }
}

// When the component is destroyed, remove the data after 20 seconds if the user doesn't return
ngOnDestroy(): void {
  this.removeTimeout = setTimeout(() => {
    this.clearSessionStorage();
    console.log("from Time interval----------------");
  }, 20000);  // Remove the list after 20 seconds
}

}


/*
Changes Implemented:
Save to LocalStorage:

After parsing the CSV or XML file, the fileContent is saved to localStorage via saveToLocalStorage().
Load from LocalStorage on Component Init:

When the component is initialized (ngOnInit), the fileContent is loaded from localStorage if it exists.
Clear LocalStorage:

The data is cleared from localStorage upon file upload, reset, or after 20 seconds of the component being destroyed (using the ngOnDestroy() lifecycle hook).
Timeout Logic:

A timeout is set when the component is destroyed, which will clear localStorage after 20 seconds. If the user navigates back within 20 seconds, you can call cancelRemoveTimeout() to cancel the timeout.
Testing the Logic:
Scenario 1: User selects a file:
The file content is parsed and saved to localStorage.
Scenario 2: User navigates away and returns within 20 seconds:
The content is loaded back from localStorage.
Scenario 3: User navigates away and returns after 20 seconds:
The localStorage is cleared after 20 seconds, and the content is no longer available.
Scenario 4: User uploads the file:
The localStorage is cleared immediately after a successful upload.
Let me know if you need any further changes!
*/
