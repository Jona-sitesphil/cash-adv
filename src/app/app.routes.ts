import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { MainLayoutComponent } from './core/main-layout/main-layout.component';
import { RequestHistoryComponent } from './features/admin/request-history/request-history.component';
import { EmployeeLayoutComponent } from './core/employee-layout/employee-layout.component';
import { EmployeedComponent } from './features/employee/employeed/employeed.component';
import { authGuard } from './auth.guard';
import { UserManagementComponent } from './features/admin/usermanagement/usermanagement.component';
import { SupervisorLayoutComponent } from './core/supervisor-layout/supervisor-layout.component';
import { SupervisorComponent } from './features/Supervisorr/supervisor/supervisor.component';
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
        component: UserManagementComponent,
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
  {
    path: 'supervisor',
    component: SupervisorLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: SupervisorComponent,
        canActivate: [authGuard],
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
