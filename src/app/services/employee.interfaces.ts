export interface CreateEmployee {
  name: string;
  birthday: string;
  age: number;
  idCargo: number;
  status: boolean;
}

export interface Employee extends CreateEmployee {
  id: number;
}

export interface EmployeeSearchOptions {
  page?: number;
  pageSize?: number;
  query?: string;
}
export interface EmployeeSearchResult {
  content: Employee[];
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
  }
  totalPages: number;
  totalElements: number;
  last: boolean;
  number: number;
}
