import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { catchError, firstValueFrom, map, Subject, switchMap, distinctUntilChanged, throttleTime, shareReplay } from 'rxjs';
import { CreateEmployee, Employee, EmployeeSearchOptions } from 'src/app/services/employee.interfaces';
import { EmployeeService } from 'src/app/services/employee.service';
import { AlertController } from '@ionic/angular';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import {isEqual} from 'lodash';

const DEFAULT_SIZE = 5
@Component({
  selector: 'app-employees',
  templateUrl: './employees.page.html',
  styleUrls: ['./employees.page.scss'],
})
export class EmployeesPage implements OnInit, ViewWillEnter, OnDestroy {

  showPageSizeOptions = true;
  pageSizeOptions = [5, 10, 15, 20];
  searchText: string = '';
  pageEvent = {
    page: 1,
    size: DEFAULT_SIZE,
  };
  updateEmployees$ = new Subject<EmployeeSearchOptions | null>();
  response$ = this.updateEmployees$.pipe(
    throttleTime(500, null as any, { leading: true, trailing: true }),
    distinctUntilChanged(isEqual),
    switchMap((opts) => this.employeeService.getAll(opts || {})),
    shareReplay(1)
  );
  employees$ = this.response$.pipe(map(r => r?.content));

  onResponseSub = this.response$.subscribe(r => {
    this.pageEvent = {
      page: r?.pageable?.pageNumber || 1,
      size: r?.pageable?.pageSize || DEFAULT_SIZE,
    };
  });

  isDesktop: boolean = true;
  toggleStatus: boolean = true;
  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private alertController: AlertController
  ) { }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  onSearchInputChange(event: CustomEvent): void {
    const newValue = (event.target as HTMLInputElement).value;
    if (newValue === this.searchText) return;
    this.searchText = newValue;
    this.pageEvent.page = 1;
    this.updateEmployees();
  }

  async presentAlert(id: number) {
    const alert = await this.alertController.create({
      header: '¿Desea eliminar este empleado?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Sí',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.employeeService.delete(id).pipe(
              catchError(error => {
                console.log("ERROR DELETING", error);
                throw error;
              })
            ).subscribe(() => {
              this.ionViewWillEnter();
              console.log("DELETED SUCCESSFULLY!");
            });
          }
        },
      ],
    });

    await alert.present();
  }

  async presentAlertStatus(employee: any) {
    const alert = await this.alertController.create({
      header: '¿Desea cambiar el estatus de este empleado?',
      cssClass: 'custom-alert',
      inputs: [
        {
          name: 'toggle',
          type: 'checkbox',
          label: 'Estatus actual: ' + (employee.status ? 'Activo' : 'Inactivo'),
          value: true,
          checked: employee.status,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Cambiar',
          cssClass: 'alert-button-confirm',
          handler: (data) => {
            const obj = {
              ...employee,
              "status": Boolean(data[0])
            }
            this.editStatus(employee.id, obj);
            this.updateEmployees();
          }
        },
      ],
    });

    await alert.present();
  }

  private async editStatus(id: Employee['id'], employee: CreateEmployee) {
    return await firstValueFrom(this.employeeService.update(id, employee));
  }

  setPageEvent($event: PageEvent) {
    this.pageEvent = {
      page: $event.pageIndex + 1,
      size: $event.pageSize
    };
    this.updateEmployees();
  }

  updateEmployees() {
    this.updateEmployees$.next(null);
    this.updateEmployees$.next({
      ...this.pageEvent,
      query: this.searchText,
    });
  }

  navigateToAnotherRoute() {
    this.router.navigate(['employees/add-employee']);
  }

  checkScreenSize() {
    this.isDesktop = window.innerWidth > 768;
  }

  ngOnInit() {
    this.checkScreenSize();
  }

  ionViewWillEnter() {
    this.updateEmployees();
  }

  editEmployee(employee: any) {
    console.log('Editing employee:', employee);
    this.router.navigate(['employees/edit-employee/' + employee.id]);
  }

  ngOnDestroy(): void {
    this.onResponseSub.unsubscribe();
  }

}
