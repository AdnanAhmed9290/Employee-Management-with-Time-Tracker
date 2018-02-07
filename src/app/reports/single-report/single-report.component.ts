
/// <reference path="./../../../assets/js/toastr.d.ts" />

import { Component, OnInit } from '@angular/core';
import { NgbDateStruct,NgbDateAdapter, NgbCalendar, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from './../../core/user';
import { ReportService } from './../shared/report.service';
import { fadeInAnimation} from "./../../shared/fadein.animation";

import * as moment from 'moment';

import { Observable } from 'rxjs/Observable';
import {Log} from "./../../activity-logs/shared/activity";

const now = moment();

@Component({
  selector: 'single-report',
  templateUrl: './single-report.component.html',
  styleUrls: ['./single-report.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})



export class SingleReportComponent implements OnInit {

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
  userId : string;
  userData : any;

  constructor(private logService: ReportService, private route: ActivatedRoute, private router: Router) {
  }


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['id']; // (+) converts string 'id' to a number
    });
    this.selectToday();
    this.maxDate =  this.dateSelected;
    this.getWeeklyData(this.dateSelected);
    this.logService.getUser(this.userId).subscribe(data=>{
      this.userData = data;
    });
  }

  getWeeklyData(date: any){
    console.log( new Date('2018-02-01T17:03:01+05:00').getTime());
    var dateOffset = (24*60*60*1000) * 7; //5 days
    let myDate = new Date();
    let start = new Date().getTime();
    let end =  myDate.setTime(myDate.getTime() - dateOffset);
    console.log('Start: '+start+', Ends: '+end);
    this.logService.getWeeklyLogsList(start,end,this.userId).subscribe(data=>{
      console.log(data);
    })

  }

  getActivityData(date:any){
    this.showSpinner = true ;
    this.logData = this.logService.getLogsList(moment(this.getDate(date)).format('YYYY/MM/DD'),this.userId);
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


}
