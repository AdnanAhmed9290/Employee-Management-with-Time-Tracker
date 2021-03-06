import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { UserLoginComponent } from './ui/user-login/user-login.component';
import { TimerComponent } from './timer/timer.component';
import { ActivityLogsComponent } from './activity-logs/activity-logs.component';
import { DocumentsComponent } from './documents/documents.component';
import { FaqComponent } from "./faq/faq.component";
import { ReportsComponent } from './reports/reports.component';
import { SingleReportComponent } from './reports/single-report/single-report.component';

import { AuthGuard } from './core/auth.guard';
import { AdminGuard } from './core/admin.guard';
import { CoreModule } from './core/core.module';

const routes: Routes = [
  { path: 'login', component: UserLoginComponent },
  { path: '', redirectTo: 'timer' , pathMatch: 'full' },
  { path: 'timer', component: TimerComponent,  canActivate: [AuthGuard] },
  { path: 'activities', component: ActivityLogsComponent,  canActivate: [AuthGuard] },
  { path: 'documents', component: DocumentsComponent,  canActivate: [AuthGuard] },
  { path: 'faq', component: FaqComponent,  canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsComponent,  canActivate: [AuthGuard, AdminGuard ]  },
  { path: 'reports/:id', component: SingleReportComponent,  canActivate: [AuthGuard, AdminGuard]},
  // { path: 'items', component: ItemsListComponent, canActivate: [AuthGuard] },
  // { path: 'notes', component: NotesListComponent,  canActivate: [AuthGuard] },
  
  // uploads are lazy loaded
  // { path: 'uploads', loadChildren: './uploads/shared/upload.module#UploadModule', canActivate: [AuthGuard] },

  // otherwise redirect to home
  { path: '**', redirectTo: 'timer' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard,AdminGuard ],
})
export class AppRoutingModule { }
