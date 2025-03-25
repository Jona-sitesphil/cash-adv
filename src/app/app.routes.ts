import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { MainLayoutComponent } from './core/main-layout/main-layout.component';
import { RequestHistoryComponent } from './features/admin/request-history/request-history.component';
import { EmployeeLayoutComponent } from './core/employee-layout/employee-layout.component';
import { HeaderComponent } from './core/header/header.component';
import { EmployeedComponent } from './features/employee/employeed/employeed.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'main',
    component: HeaderComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'request-history', component: RequestHistoryComponent },
    ],
  },
  {
    path: 'employee',
    component: EmployeeLayoutComponent,
    children: [{ path: 'dashboard', component: EmployeedComponent }],
  },
];
