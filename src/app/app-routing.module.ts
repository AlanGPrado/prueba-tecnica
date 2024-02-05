import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AddEmployeePage } from './main/add-employee/add-employee.page';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/employees',
    pathMatch: 'full'
  },
  {
    path: 'employees',
    loadChildren: () => import('./main/employees/employees.module').then(m => m.EmployeesPageModule)
  },
  {
    path: 'employees/add-employee',
    loadChildren: () => import('./main/add-employee/add-employee.module').then(m => m.AddEmployeePageModule)
  },
  {
    path: 'employees/edit-employee/:id',
    component: AddEmployeePage
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
