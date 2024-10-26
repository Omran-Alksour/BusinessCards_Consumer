import { Injectable } from '@angular/core';
import { BusinessCardService } from '../../BusinessCard/business-card.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(private businessCardService: BusinessCardService) {}

  private downloadFile(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // For .csv and .XML
  exportAndDownloadBusinessCards(format: string, IDs: (string | undefined)[] | undefined = undefined): void {
    this.businessCardService.exportBusinessCardsFile(format, IDs).subscribe({
      next: (blob: Blob) => {
        const formattedDate = new Date().toISOString()
          .slice(0, 19)
          .replace(/:/g, '-')
          .replace('T', '-');
        const fileName = `Omran-Alksour_Business-Cards_${formattedDate}.${format}`;
        this.downloadFile(blob, fileName);
      },
      error: (err: any) => {
        console.log('Error exporting business cards:', err);
      }
    });
  }

  generateAndDownloadQrCode(businessCard: IBusinessCard): void {
    this.businessCardService.generateQrCode(businessCard).subscribe({
      next: (response: Blob) => {
        const fileName = `QR_Code_BusinessCard_${businessCard.name.replace(' ', '_')}.png`;
        this.downloadFile(response, fileName);
      },
      error: (err: any) => {
        console.error('Error generating QR code:', err);
      }
    });
  }
}
