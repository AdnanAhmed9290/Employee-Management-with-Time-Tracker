/// <reference path="../../assets/js/toastr.d.ts" />

import { Component, OnInit } from '@angular/core';
import { fadeInAnimation} from "./../shared/fadein.animation";
import {NgbDateStruct,NgbDateAdapter, NgbCalendar, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { ActivityLogsService } from './shared/activity-logs.service';

import * as moment from 'moment';

import { Observable } from 'rxjs/Observable';

import {Log} from "./shared/activity";

// @Injectable()
// export class NgbDateNativeAdapter extends NgbDateAdapter<Date> {

//   fromModel(date: Date): NgbDateStruct {
//     return (date && date.getFullYear) ? {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()} : null;
//   }

//   toModel(date: NgbDateStruct): Date {
//     return date ? new Date(Date.UTC(date.year, date.month - 1, date.day)) : null;
//   }
// }


const now = moment();

@Component({
  selector: 'activity-logs',
  templateUrl: './activity-logs.component.html',
  styleUrls: ['./activity-logs.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class ActivityLogsComponent implements OnInit {

  logData: Observable<Log[]>;
  showSpinner = true;
  dateSelected: NgbDateStruct;
  maxDate: any;
  date: {year: number, month: number};
  maxDateFlag : boolean = true;
  cycles = {
    pomodoro : 0,
    data : true
  };
  dateModel : Date;

  constructor(private logService: ActivityLogsService) {
    this.selectToday();
  }


  ngOnInit() {

    this.maxDate =  this.dateSelected;

  }

  getActivityData(date:any){
    this.showSpinner = true ;
    this.logData = this.logService.getLogsList(moment(this.getDate(date)).format('YYYY/MM/DD'));
    this.logData.subscribe((x) => {
      let counter = 0;
      x.forEach(element => {
        if(element.type == 'pomodoro')  
          ++counter;
      });
      if(x.length == 0)
        this.cycles.data = true;
      else
        this.cycles.data = false;
      this.cycles.pomodoro = counter;
      this.showSpinner = false;
    },error => {
      this.cycles.data = true;
      this.showSpinner = false ;
    });
  }

  getDate(d: any): any{
    let date = d.year+"/"+d.month+"/"+d.day;
    return date;
  }

  selectToday() {
    this.dateSelected = {year: now.year(), month: now.month() + 1, day: now.date() };
    this.getActivityData(this.dateSelected);
    // if(this.compareDates(this.dateSelected,this.maxDate)){
    //     this.maxDateFlag = true;
    // }
  }
  
  subDate(){
    let currentDate  = moment(this.getDate(this.dateSelected)); 
    currentDate.subtract(1,'d');
    this.dateSelected = {year: currentDate.year() , month: currentDate.month()+1, day: currentDate.date()};
    this.maxDateFlag = false;
    this.getActivityData(this.dateSelected);
  }

  onDateChange(){

    this.getActivityData(this.dateSelected);
    if(this.compareDates(this.dateSelected,this.maxDate)){
        this.maxDateFlag = true;
    }
    else{
      this.maxDateFlag = false;
    }
  }

  compareDates(date1:any ,date2:any ){
     return moment(this.getDate(date1)) >= moment(this.getDate(date2));
  }

  addDate(){
    let currentDate  = moment(this.getDate(this.dateSelected)); 
    currentDate.add(1,'d');
    this.dateSelected = {year: currentDate.year() , month: currentDate.month()+1, day: currentDate.date()};
    if(this.compareDates(this.dateSelected,this.maxDate)){
        this.maxDateFlag = true;
    }
    this.getActivityData(this.dateSelected);
  }

  // createP(){
  //   let content : any = {
  //     type: "pomodoro",
  //     task: "Create Module Added",
  //     project: "Babywink Web",
  //     duration: 25
  //   }
  //   this.logService.createLog(content);
  // }

  // createS(){
  //   let content : any = {
  //     type: "short break",
  //     task: "",
  //     project: "",
  //     duration: 5
  //   }
  //   this.logService.createLog(content);
  // }

  // createC(){
  //   let content : any = {
  //     type: "coffee break",
  //     task: "",
  //     project: "",
  //     duration: 10
  //   }
  //   this.logService.createLog(content);
  // }

  // createL(){
  //   let content : any = {
  //     type: "long break",
  //     task: "",
  //     project: "",
  //     duration: 30
  //   }
  //   this.logService.createLog(content);
  // }


}
