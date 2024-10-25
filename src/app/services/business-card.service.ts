import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, IBusinessCard } from '../pages/shared/models/BusinessCard';

@Injectable({
  providedIn: 'root',
})
export class BusinessCardservice {
  BASE_URL = 'https://localhost:7017';
  constructor(private http: HttpClient) {}

  getAllBusinessCards(): Observable<ApiResponse<IBusinessCard[]>> {
    return this.http.get<ApiResponse<IBusinessCard[]>>(`${this.BASE_URL}`);
  }

  getBusinessCard(id: string): Observable<ApiResponse<IBusinessCard>> {
    return this.http.get<ApiResponse<IBusinessCard>>(`${this.BASE_URL}/${id}`);
  }

  createBusinessCard(bussineesCard: IBusinessCard): Observable<any> {
    return this.http.post(`${this.BASE_URL}`, bussineesCard);
  }

  updateBusinessCard(id: string, bussineesCard: IBusinessCard): Observable<any> {
    return this.http.put(`${this.BASE_URL}/${id}`, bussineesCard);
  }

  deleteBusinessCard(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.BASE_URL}/${id}`);
  }
}
