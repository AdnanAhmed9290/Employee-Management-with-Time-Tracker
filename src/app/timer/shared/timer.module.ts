import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountdownModule } from 'ngx-countdown';
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { AsyncLocalStorageModule } from 'angular-async-local-storage';

import { SharedModule } from '../../shared/shared.module';

import { AngularFireDatabaseModule } from 'angularfire2/database';

import { TimerService } from './timer.service';

import { HttpModule } from '@angular/http';
import { TimerComponent } from './../timer.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    AngularFireDatabaseModule,
    ReactiveFormsModule,
    CountdownModule,
    AsyncLocalStorageModule,
    HttpModule
  ],
  declarations: [
    TimerComponent,
  ],
  providers: [
    TimerService,
  ],
})
export class TimerModule { }
