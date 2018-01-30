import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModule} from './../../ui/shared/ui.module';

import { CountdownModule } from 'ngx-countdown';
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { AsyncLocalStorageModule } from 'angular-async-local-storage';

import { SharedModule } from '../../shared/shared.module';

import { AngularFireDatabaseModule } from 'angularfire2/database';

import { TimerService } from './timer.service';

import { HttpModule } from '@angular/http';
import { TimerComponent } from './../timer.component';

// import { NotificationMessageComponent } from './../../ui/notification-message/notification-message.component';


@NgModule({
  imports: [
    
    // NotificationMessageComponent   ,
    CommonModule,
    SharedModule,
    FormsModule,
    AngularFireDatabaseModule,
    ReactiveFormsModule,
    CountdownModule,
    AsyncLocalStorageModule,
    HttpModule,
    UiModule 

  ],
  declarations: [
    TimerComponent,
  ],
  providers: [
    TimerService,
  ],
})
export class TimerModule { }
