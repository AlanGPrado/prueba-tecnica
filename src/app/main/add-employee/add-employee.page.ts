import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PickerController, ToastController, NavController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { CreateEmployee, Employee } from 'src/app/services/employee.interfaces';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.page.html',
  styleUrls: ['./add-employee.page.scss'],
})
export class AddEmployeePage implements OnInit, OnDestroy {

  currentUserId: number | null = null;

  selectedStatus: string = "";
  myForm!: FormGroup;
  toggleStatus: boolean = true;
  statusName: string = "";
  dateToRender: string = "Fecha de Nacimiento";
  formTitle: string = "Añadir Empleado";
  cargos = {
    "content": [
      {
        "id": 1,
        "descripcion": "Gerente"
      },
      {
        "id": 2,
        "descripcion": "Coordinador"
      },
      {
        "id": 3,
        "descripcion": "Subdirector"
      }
    ]
  }

  constructor(
    private formBuilder: FormBuilder,
    private pickerCtrl: PickerController,
    private employeeService: EmployeeService,
    private toastController: ToastController,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
  ) {
    (window as any)['$form'] = this;

    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      birthday: ['', Validators.required],
      age: ['', Validators.required],
      status: [true, Validators.required],
      idCargo: ['', Validators.required]
    });
  }

  paramsSubscription = this.activatedRoute.params.subscribe(params => this.setupForm(params['id']))

  setupForm(uid: string) {
    this.currentUserId = Number(uid) || null;
    this.myForm.setValue({
      name: '',
      birthday: '',
      age: '',
      status: true,
      idCargo: '',
    })
    this.loadEmployeeDataToEdit();
  }

  async loadEmployeeDataToEdit() {
    if (!this.currentUserId) return;
    const employee: any = await firstValueFrom(this.employeeService.get(this.currentUserId));
    this.myForm.setValue({
      name: employee.name,
      birthday: employee.birthday,
      age: employee.age,
      status: employee.status,
      idCargo: '' + employee.idCargo
    })
    this.formTitle = 'Editar Empleado';
    let date: any = new Date(this.myForm.value.birthday);
    this.dateToRender = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const myDiv = document.getElementById('date') as HTMLDivElement;
    myDiv.style.color = "#FFFF";
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }


  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: 'dark'
    });
    toast.present();
  }

  async formValidatorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: 'dark'
    });
    toast.present();
  }

  get firstName() { return this.myForm.get('name'); }
  get lastName() { return this.myForm.get('age'); }
  get email() { return this.myForm.get('email'); }

  async openDatePicker() {
    const picker = await this.pickerCtrl.create({
      columns: [
        {
          name: 'day',
          options: this.generateOptions(1, 31),
        },
        {
          name: 'month',
          options: this.generateOptions(1, 12),
        },
        {
          name: 'year',
          options: this.generateOptions(1900, 2030), // Adjust the range as needed
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: (value) => {
            const myDiv = document.getElementById('date') as HTMLDivElement;
            myDiv.style.color = "#FFFF";
            const selectedDate = new Date(value.year.value, value.month.value - 1, value.day.value);
            this.myForm.value.birthday = selectedDate.getDate();
            this.myForm.get('birthday')?.setValue(selectedDate.getTime());
            console.log(selectedDate.getTime(), "unix date");
            this.dateToRender = selectedDate.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            });
          },
        },
      ],
    });

    await picker.present();
  }

  generateOptions(start: number, end: number) {
    const options = [];
    for (let i = start; i <= end; i++) {
      options.push({
        text: i.toString().padStart(2, '0'),
        value: i,
      });
    }
    return options;
  }

  toggleStateChanged(event: any) {
    this.toggleStatus = event.detail.checked;
    this.statusName = this.toggleStatus ? "Activo" : "Inactivo";
  }

  ngOnInit() {
  }

  private async create(employee: CreateEmployee) {
    return await firstValueFrom(this.employeeService.create(employee));
  }

  private async edit(id: Employee['id'], employee: CreateEmployee) {
    return await firstValueFrom(this.employeeService.update(id, employee));
  }

  getFormValue() {
    return {
      ...this.myForm.value,
      idCargo: Number(this.myForm.value.idCargo),
    };
  }

  addEmployee() {
    const filteredData = Object.keys(this.getFormValue()).filter(key => this.getFormValue()[key] === "" || this.getFormValue()[key] === 0);
    const keyMapping: any = {
      name: 'Nombre',
      birthday: 'Fecha de Nacimiento',
      age: 'Edad',
      idCargo: 'Cargo',
    };

    filteredData.forEach((currentValue, index, array) => {
      if (keyMapping[currentValue]) {
        array[index] = keyMapping[currentValue];
      }
    });

    if (filteredData.length > 0) {
      this.formValidatorToast("Falta por llenar campos: " + filteredData.join(", "));
      return;
    }
    this.navCtrl.navigateBack("/employees");
    this.presentToast('Empleado agregado correctamente.');
    this.create(this.getFormValue());
  }

  editEmployee() {
    this.navCtrl.navigateBack("/employees");
    this.presentToast('Empleado editado correctamente.');
    this.edit(this.currentUserId as number, this.getFormValue());
  }

}
