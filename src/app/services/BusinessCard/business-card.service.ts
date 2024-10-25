import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, IBusinessCard, PagedResponse } from '../../pages/shared/models/BusinessCard';

@Injectable({
  providedIn: 'root',
})
export class BusinessCardservice {
  BASE_URL = 'https://localhost:7017/api/BusinessCard';
  constructor(private http: HttpClient) {}

  getBusinessCards(pageNumber:number=1,pageSize:number=10,orderBy:string="LastUpdateAt",orderDirection:string="desc",search:string|null=null): Observable<ApiResponse<PagedResponse<IBusinessCard>>> {
    return this.http.get<ApiResponse<PagedResponse<IBusinessCard>>>(`${this.BASE_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}&orderBy=${orderBy}&orderDirection=${orderDirection}${search?`&search=${search}`:""}`);
  }

  getBusinessCard(id: string): Observable<ApiResponse<IBusinessCard>> {
    return this.http.get<ApiResponse<IBusinessCard>>(`${this.BASE_URL}/${id}`);
  }

  createBusinessCard(businessCard: IBusinessCard): Observable<any> {

    const formData = this.objectToFormData<IBusinessCard>(businessCard);
    return this.http.post(this.BASE_URL, formData);
  }

  updateBusinessCard(id: string, bussineesCard: IBusinessCard): Observable<any> {
    return this.http.put(`${this.BASE_URL}/${id}`, bussineesCard);
  }

  deleteBusinessCards( IDs: (string | undefined)[] | undefined = undefined): Observable<ApiResponse<any>> {
    debugger;
let result =this.http.delete<ApiResponse<any>>(`${this.BASE_URL}?forceDelete=false`, {
  body: IDs
});
debugger;

    return result;
  }



  exportBusinessCardsFile(format: string, IDs: (string | undefined)[] | undefined = undefined): Observable<Blob> {
    let params = new HttpParams().set('format', format);

    if (IDs && IDs.length > 0) {
      IDs.forEach((id) => {
        if (id) {
          params = params.append('IDs', id);
        }
      });
    }
    return this.http.get(`${this.BASE_URL}/export`, {
      params: params,
      responseType: 'blob'
    });
  }


  objectToFormData<T extends object>(formValue: T): FormData {
    const formData = new FormData();

    Object.keys(formValue).forEach(key => {
      const value = (formValue as any)[key];

      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    return formData;
  }
}
