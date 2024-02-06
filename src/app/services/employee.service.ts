import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {Employee, CreateEmployee, EmployeeSearchOptions, EmployeeSearchResult } from './employee.interfaces';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  apiPath = environment.api + '/employee/';

  constructor(private http: HttpClient) { }

  getAll(options: EmployeeSearchOptions ={}) {
    const params = new HttpParams({fromObject: options as any});
    /* Object.entries(options).forEach(([key, value]) => params.set(key,value));*/
    console.log(options, params.toString());
    return this.http.get<EmployeeSearchResult>(this.apiPath, { params });
  }

  get(id: Employee['id']) {
    return this.http.get<Employee>(this.apiPath+id);
  }

  create(employee:CreateEmployee) {
    return this.http.post<Employee>(this.apiPath, employee);
  }

  update(id: Employee['id'], employee:Partial<CreateEmployee>) {
    return this.http.put<Employee>(this.apiPath + id, employee);
  }

  delete(id: Employee['id']) {
    return this.http.delete(this.apiPath + id);
  }

}
