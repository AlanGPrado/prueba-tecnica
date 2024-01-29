export interface CreateEmployee {
  nombre: string;
  fechaNacimiento: string;
  edad: number;
  idCargo: string;
  estatus: boolean;
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
