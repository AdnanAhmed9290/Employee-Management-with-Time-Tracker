import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { UserLoginComponent } from './ui/user-login/user-login.component';
import { ItemsListComponent } from './items/items-list/items-list.component';
import { NotesListComponent } from './notes/notes-list/notes-list.component';
import { TimerComponent } from './timer/timer.component';
import { ActivityLogsComponent } from './activity-logs/activity-logs.component';

import { AuthGuard } from './core/auth.guard';
import { CoreModule } from './core/core.module';

const routes: Routes = [
  { path: 'login', component: UserLoginComponent },
  { path: '', redirectTo: 'timer' , pathMatch: 'full' },
  { path: 'timer', component: TimerComponent,  canActivate: [AuthGuard] },
  { path: 'activities', component: ActivityLogsComponent,  canActivate: [AuthGuard] },
  { path: 'items', component: ItemsListComponent, canActivate: [AuthGuard] },
  { path: 'notes', component: NotesListComponent,  canActivate: [AuthGuard] },
  
  // uploads are lazy loaded
  { path: 'uploads', loadChildren: './uploads/shared/upload.module#UploadModule', canActivate: [AuthGuard] },

  // otherwise redirect to home
  { path: '**', redirectTo: 'timer' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule { }
