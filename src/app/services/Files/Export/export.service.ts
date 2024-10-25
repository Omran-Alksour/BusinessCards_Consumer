import { Injectable } from '@angular/core';
import { BusinessCardservice } from '../../BusinessCard/business-card.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(private businessCardService: BusinessCardservice) {}

  exportAndDownloadBusinessCards(format: string, IDs: (string | undefined)[] | undefined = undefined): void {
    this.businessCardService.exportBusinessCardsFile(format, IDs).subscribe({
      next: (blob: Blob) => {
        this.downloadBusinessCards(blob, format); // Download the received file (Blob)
      },
      error: (err:any) => {
        console.log('Error exporting business cards:', err); // Handle any errors
      }
    });
  }



  downloadBusinessCards(blob: Blob, format: string): void {
 debugger;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    const formattedDate = new Date().toISOString()
      .slice(0, 19)
      .replace(/:/g, '-')
      .replace('T', '-');

    a.download = `Omran-Alksour_business-cards_${formattedDate}.${format}`;

    // Append & download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
