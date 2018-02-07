import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModule} from './../../ui/shared/ui.module';
import { RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { DataTableModule } from 'angular-4-data-table';
import { SharedModule } from '../../shared/shared.module';

import { 
  MatTableModule, 
  MatFormFieldModule, 
  MatInputModule, 
  MatSortModule, 
  MatDialogModule, 
  MatPaginatorModule,
  MatButtonModule, 
  MatCardModule,
} from '@angular/material';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';

// import {CdkTableModule} from '@angular/cdk/table';
// import { AngularFireDatabaseModule } from 'angularfire2/database';

import { ReportsComponent } from './../reports.component';
import { ReportService } from './report.service';
import { SingleReportComponent } from './../single-report/single-report.component';
// import { NotificationMessageComponent } from './../../ui/notification-message/notification-message.component';


@NgModule({
  imports: [
    // BrowserAnimationsModule,
    // NotificationMessageComponent   ,
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule,
    UiModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatCardModule,
    // MatTabsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    NgbModule.forRoot()

  ],
  declarations: [
    ReportsComponent,
    SingleReportComponent
  ],
  providers: [
    ReportService,
  ],
})
export class ReportsModule { }
