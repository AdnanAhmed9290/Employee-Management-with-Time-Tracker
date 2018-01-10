import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from "@angular/forms";

import { SharedModule } from '../../shared/shared.module';

import { AngularFireDatabaseModule } from 'angularfire2/database';

import { ActivityLogsService } from './activity-logs.service';

import { ActivityLogsComponent } from './../activity-logs.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    AngularFireDatabaseModule,
    NgbModule.forRoot()
  ],
  declarations: [
    ActivityLogsComponent,
  ],
  providers: [
    ActivityLogsService,
  ],
})
export class ActivityLogsModule { }
