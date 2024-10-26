import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  BASE_URL = environment.BASE_URL;

  constructor(private http: HttpClient) {}

  importBusinessCards(file: File): Observable<ApiResponse<ImportResponse>> {
    const formData = new FormData();
    formData.append('FileImport', file);

    return this.http.post<ApiResponse<ImportResponse>>(
      `${this.BASE_URL}/import`,
      formData
    );
  }


  decodeQrCode(file: File): Observable<ApiResponse<IBusinessCard>> {
    const formData = new FormData();
    formData.append('QRCodeFile', file);

    return this.http.post<ApiResponse<IBusinessCard>>(
      `${this.BASE_URL}/decodeQrCode`,
      formData
    );
  }


  generateQrCode(businessCard: any): Observable<Blob> {
    return this.http.post(`${this.BASE_URL}/generateQrCode`, businessCard, { responseType: 'blob' });
  }


}
