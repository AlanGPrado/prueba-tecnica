import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


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
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
