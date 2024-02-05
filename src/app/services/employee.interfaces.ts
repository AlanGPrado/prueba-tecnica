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
}
export interface EmployeeSearchResult {
  content:Employee[];
}
