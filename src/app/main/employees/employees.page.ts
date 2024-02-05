import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { catchError, firstValueFrom, map, Subject, switchMap } from 'rxjs';
import { CreateEmployee, Employee, EmployeeSearchOptions } from 'src/app/services/employee.interfaces';
import { EmployeeService } from 'src/app/services/employee.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.page.html',
  styleUrls: ['./employees.page.scss'],
})
export class EmployeesPage implements OnInit, ViewWillEnter {

  searchText: string = '';
  updateEmployees$ = new Subject<EmployeeSearchOptions | null>();
  response$ = this.updateEmployees$.pipe(
    switchMap((opts) => this.employeeService.getAll(opts || {}))
  )
  employees$ = this.response$.pipe(map(r => r?.content));
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
    this.searchText = (event.target as HTMLInputElement).value;
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
          label: 'Estatus actual: '+ (employee.status ? 'Activo' : 'Inactivo'),
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
              "status": !!data[0]
            }
            this.editStatus(employee.id, obj);
            this.ionViewWillEnter();
          }
        },
      ],
    });

    await alert.present();
  }

  private async editStatus(id: Employee['id'], employee: CreateEmployee) {
    return await firstValueFrom(this.employeeService.update(id, employee));
  }

  updateEmployees() {
    this.updateEmployees$.next(null);
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
    this.router.navigate(['employees/edit-employee/'+employee.id]);
  }

}
