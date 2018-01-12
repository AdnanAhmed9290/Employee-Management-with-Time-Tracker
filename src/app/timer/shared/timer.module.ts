import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountdownModule } from 'ngx-countdown';
import { FormsModule,ReactiveFormsModule } from "@angular/forms";

import { SharedModule } from '../../shared/shared.module';

import { AngularFireDatabaseModule } from 'angularfire2/database';

import { TimerService } from './timer.service';

import { TimerComponent } from './../timer.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    AngularFireDatabaseModule,
    ReactiveFormsModule,
    CountdownModule
  ],
  declarations: [
    TimerComponent,
  ],
  providers: [
    TimerService,
  ],
})
export class TimerModule { }