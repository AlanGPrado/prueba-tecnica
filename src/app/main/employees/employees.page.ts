import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { map, Subject, switchMap } from 'rxjs';
import { EmployeeSearchOptions } from 'src/app/services/employee.interfaces';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.page.html',
  styleUrls: ['./employees.page.scss'],
})
export class EmployeesPage implements OnInit, ViewWillEnter {
  obj = {
    "content": [
      {
        "id": 1,
        "nombre": "Maria Mendoza Lopez",
        "fechaNacimiento": 1653026400000,
        "edad": 32,
        "estatus": true,
        "idCargo": 1
      }
    ],
    "pageable": {
      "sort": {
        "empty": false,
        "sorted": true,
        "unsorted": false
      },
      "offset": 0,
      "pageNumber": 0,
      "pageSize": 100,
      "paged": true,
      "unpaged": false
    },
    "totalPages": 1,
    "totalElements": 6,
    "last": true,
    "number": 0,
    "sort": {
      "empty": false,
      "sorted": true,
      "unsorted": false
    },
    "size": 10,
    "numberOfElements": 6,
    "first": true,
    "empty": false
  }

  updateEmployees$ = new Subject<EmployeeSearchOptions | null>();
  response$ = this.updateEmployees$.pipe(
    switchMap((opts) => this.employeeService.getAll(opts || {}))
  )
  employees$ = this.response$.pipe(map(r => r?.content));

  constructor(private router: Router,
    private employeeService: EmployeeService
  ) { }


  updateEmployees() {
    this.updateEmployees$.next(null);
  }

  navigateToAnotherRoute() {
    this.router.navigate(['employees/add-employee']);
  }

  ngOnInit() { }

  ionViewWillEnter() {
    this.updateEmployees();
  }

}
