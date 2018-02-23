import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { ROUTER_PROVIDERS } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Core
import { CoreModule } from './core/core.module';

// Shared/Widget
import { SharedModule } from './shared/shared.module';

// Feature Modules
import { UiModule } from './ui/shared/ui.module';
import { ActivityLogsModule } from './activity-logs/shared/activity-logs.module';
import { TimerModule } from './timer/shared/timer.module';
import { ReportsModule } from './reports/shared/report.module';
import { environment } from '../environments/environment';
// import { NotificationMessageComponent } from './ui/notification-message/notification-message.component';

// import {  DataTableModule } from 'angular-4-data-table-bootstrap-4';

///// Start FireStarter

import { AngularFireModule } from 'angularfire2';
export const firebaseConfig = environment.firebaseConfig;
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { DocumentsComponent } from './documents/documents.component';
import { FaqComponent } from './faq/faq.component';
///// End FireStarter

@NgModule({
  declarations: [
    AppComponent,
    DocumentsComponent,
    FaqComponent
    // NotificationMessageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    UiModule,
    ActivityLogsModule,
    TimerModule,
    ReportsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule.enablePersistence()
  ],
  // exports:[
    
  //   NotificationMessageComponent
  // ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
