import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class BusinessCardService {
  BASE_URL = environment.BASE_URL;

  isViewMode: boolean = false;

  private _currentBusinessCard = new BehaviorSubject<IBusinessCard | null>(null);
  currentBusinessCard$ = this._currentBusinessCard.asObservable();

  set currentBusinessCard(value: IBusinessCard | null) {
    this._currentBusinessCard.next(value);
  }

  get currentBusinessCard(): IBusinessCard | null {
    return this._currentBusinessCard.value;
  }

  constructor(private http: HttpClient) {}

  getBusinessCards(
    pageNumber: number = 1,
    pageSize: number = 10,
    orderBy: string = 'Name',
    orderDirection: string = 'desc',
    search: string | null = null
  ): Observable<ApiResponse<PagedResponse<IBusinessCard>>> {
    return this.http.get<ApiResponse<PagedResponse<IBusinessCard>>>(
      `${
        this.BASE_URL
      }?withBase64=true&pageNumber=${pageNumber}&pageSize=${pageSize}&orderBy=${orderBy}&orderDirection=${orderDirection}${
        search ? `&search=${search}` : ''
      }`
    );
  }

  getBusinessCard(id: string): Observable<ApiResponse<IBusinessCard>> {
    return this.http.get<ApiResponse<IBusinessCard>>(`${this.BASE_URL}/${id}`);
  }


createBusinessCard(businessCard: IBusinessCard): { newBusinessCard: IBusinessCard, postObservable: Observable<any> } {
  const formData = this.objectToFormData<IBusinessCard>(businessCard);
  const postObservable = this.http.post(this.BASE_URL, formData);

  return {
    newBusinessCard: businessCard,
    postObservable: postObservable
  };
}
  updateBusinessCard(
    id: string,
    bussineesCard: IBusinessCard
  ): Observable<any> {
    return this.http.put(`${this.BASE_URL}/${id}`, bussineesCard);
  }

  deleteBusinessCards(
    IDs: (string | undefined)[] | undefined = undefined,forceDelete:boolean=false
  ): Observable<ApiResponse<any>> {
    debugger;
    let result = this.http.delete<ApiResponse<any>>(
      `${this.BASE_URL}?forceDelete=${forceDelete}`,
      {
        body: IDs,
      }
    );
    debugger;

    return result;
  }

  exportBusinessCardsFile(
    format: string,
    IDs: (string | undefined)[] | undefined = undefined
  ): Observable<Blob> {
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
      responseType: 'blob',
    });
  }

  objectToFormData<T extends object>(formValue: T): FormData {
    const formData = new FormData();

    Object.keys(formValue).forEach((key) => {
      const value = (formValue as any)[key];

      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    return formData;
  }


    // convert image to Base64
    convertToBase64(file: File): Observable<ApiResponse<string>> {
      const formData = new FormData();
      formData.append('photoFile', file);

      return this.http.post<ApiResponse<string>>(`${this.BASE_URL}/convertImageToBase64`, formData);
    }


    generateQrCode(businessCard: IBusinessCard): Observable<Blob> {
      return this.http.post(`${this.BASE_URL}/generateQrCode`, businessCard, {
        responseType: 'blob',
      });
    }
}
