import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ServicesComponent } from './services/services.component';
import { AppointmentCreateComponent } from './appointments/create/appointment-create.component';
import { AppointmentsMineComponent } from './appointments/mine/appointments-mine.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { AppointmentsAdminComponent } from './appointments/admin/appointments-admin.component';
import { ReportEmployeeComponent } from './reports/report-employee/report-employee.component';
import { ScheduleAvailableComponent } from './schedule/available/schedule-available.component';
import { ScheduleCreateComponent } from './schedule/create/schedule-create.component';
import { MainLayoutComponent } from './layout/main-layout.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { roleGuard } from './auth/role.guard';
import { authGuard } from './auth/auth.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ScheduleMyComponent } from './schedule/mine/schedule-my.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: "",
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'services', component: ServicesComponent },
      { path: 'appointments/create', component: AppointmentCreateComponent },
      { path: 'appointments/mine', component: AppointmentsMineComponent },
      { path: 'schedule', component: ScheduleComponent },
      { path: 'appointments/admin', component: AppointmentsAdminComponent, canActivate: [roleGuard(['admin'])] },
      { path: 'reports/employee', component: ReportEmployeeComponent, canActivate: [roleGuard(['admin'])] },
      { path: 'schedule/generate', component: ScheduleCreateComponent, canActivate: [roleGuard(['admin'])] },
      { path: 'schedule/available', component: ScheduleAvailableComponent },
      { path: 'schedule/my', component: ScheduleMyComponent },
      { path: 'unauthorized', component: UnauthorizedComponent },
      {path: 'profile', component: UserProfileComponent}
    ]
  }

];
