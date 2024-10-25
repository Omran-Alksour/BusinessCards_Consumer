export interface IBusinessCard {
  id?: string;
  name: string;
  gender: number;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  photo?: string;
  lastUpdateAt?: string;
}

export interface PagedResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: T[];
}

export interface ApiResponse<T> {
  value: T;
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

