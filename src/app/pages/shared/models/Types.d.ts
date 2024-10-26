interface IBusinessCard {
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

interface PagedResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: T[];
}

interface ApiResponse<T> {
  value: T;
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

interface ImportResponse {
  success: string[];
  failed: string[];
}

