import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeesPageRoutingModule } from './employees-routing.module';

import { EmployeesPage } from './employees.page';
import { HttpClientModule } from '@angular/common/http';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import {MatPaginatorModule} from '@angular/material/paginator';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeesPageRoutingModule,
    MatPaginatorModule
  ],
  declarations: [EmployeesPage, FilterPipe]
})
export class EmployeesPageModule {}
