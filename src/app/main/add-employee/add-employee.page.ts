import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PickerController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { CreateEmployee } from 'src/app/services/employee.interfaces';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.page.html',
  styleUrls: ['./add-employee.page.scss'],
})
export class AddEmployeePage implements OnInit {
  myForm!: FormGroup;

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
  ) {
    (window as any)['$form'] = this;

    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      age: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
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
            const selectedDate = new Date(value.year.value, value.month.value - 1, value.day.value);
            const formattedDate = this.formatDate(selectedDate);
            window.alert(`You selected the date: ${formattedDate}`);
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

  formatDate(date: Date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }



  ngOnInit() {

  }

  private async create(employee: CreateEmployee) {
    return await firstValueFrom(this.employeeService.create(employee));
  }

}
