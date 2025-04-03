import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { MainLayoutComponent } from './core/main-layout/main-layout.component';
import { RequestHistoryComponent } from './features/admin/request-history/request-history.component';
import { EmployeeLayoutComponent } from './core/employee-layout/employee-layout.component';
import { EmployeedComponent } from './features/employee/employeed/employeed.component';
import { authGuard } from './auth.guard';
import { UsermanagementComponent } from './features/admin/usermanagement/usermanagement.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'main',
    component: MainLayoutComponent,

    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
      },
      {
        path: 'request-history',
        component: RequestHistoryComponent,
        canActivate: [authGuard],
      },
      {
        path: 'usermanagement',
        component: UsermanagementComponent,
        canActivate: [authGuard],
      },
    ],
  },

  {
    path: 'employee',
    component: EmployeeLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: EmployeedComponent,
        canActivate: [authGuard],
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
