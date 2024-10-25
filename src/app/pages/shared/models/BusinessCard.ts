export interface IBusinessCard {
  id?: string;
  name: string;
  gender: number; 
  dob: string;
  email: string;
  phone: string;
  address: string;
  photo?: string;
  lastUpdateAt?: string; 
  }

export interface ApiResponse<T> {
  message?: string;
  data: T;
}


