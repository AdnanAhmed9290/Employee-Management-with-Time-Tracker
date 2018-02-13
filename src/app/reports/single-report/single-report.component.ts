
/// <reference path="./../../../assets/js/toastr.d.ts" />

import { Component, OnInit, AfterContentInit } from '@angular/core';
import { NgbDateStruct,NgbDateAdapter, NgbCalendar, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from './../../core/user';
import { ReportService } from './../shared/report.service';
import { fadeInAnimation} from "./../../shared/fadein.animation";

import * as moment from 'moment';

import { Observable } from 'rxjs/Observable';
import {Log} from "./../../activity-logs/shared/activity";
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

const now = moment();

@Component({
  selector: 'single-report',
  templateUrl: './single-report.component.html',
  styleUrls: ['./single-report.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})



export class SingleReportComponent implements OnInit, AfterViewInit {

  logData: Observable<Log[]>;
  showProgress = true;
  color = 'primary';
  mode = 'indeterminate';
  dateSelected: NgbDateStruct;
  dayOffset = 24*60*60*1000;
  maxDate: any;
  date: {year: number, month: number};
  maxDateFlag : boolean = true;
  cycles = {
    pomodoro : 0
  };
  dateModel : Date;
  userId : string;
  userData : any;
  dailyPomodoro= [];
  week = {start: null,end: null};
  month = {start: null,end: null};
  current: any;

  public ChartLabels:string[] = ['Pomodoro', 'Short Break', 'Coffee Break', 'Long Break'];
  public WeeklyChartData: any;
  public MonthlyChartData: any;
  public checkweeklyData = Observable.of(null);
  public checkmonthlyData = Observable.of(null);
  public WeeklyChartType:string = 'doughnut';
  public MonthlyChartType:string = 'pie';

  constructor(private logService: ReportService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['id']; // (+) converts string 'id' to a number
    });
    
    this.dateSelected = {year: now.year(), month: now.month() + 1, day: now.date() };
    this.maxDate =  this.dateSelected;

    this.logService.getUser(this.userId).subscribe(data=>{
      this.userData = data;
    });

  }

  ngAfterViewInit(){
    
    this.selectToday();
    // this.current  = Observable.of(moment(this.getDate(this.dateSelected)))
  }

  getWeeklyData(date: any){
    
    this.showProgress = true;
    var dateOffset =  this.dayOffset* 6; //7 days
    let myDate = new Date(this.getDate(date));
    this.week.start = new Date(this.getDate(date)).getTime();
    // console.log(new Date(this.week.start));
    this.week.end =  myDate.setTime(myDate.getTime() - dateOffset);
    let weekly = {
      pomdoro: 0,
      short: 0,
      coffee: 0,
      long: 0
    };

    this.logService.getWeeklyLogsList(this.week.start + this.dayOffset ,this.week.end,this.userId).subscribe(data=>{
      data.forEach(element => {
        if(element.type == 'pomodoro'){
          weekly.pomdoro++;
        }else if(element.type == 'short break'){
          weekly.short++;
        }
        else if(element.type == 'coffee break'){
          weekly.coffee++;
        }
        else if(element.type == 'long break'){
          weekly.long++;
        }  
      });

      this.WeeklyChartData = [weekly.pomdoro,weekly.short,weekly.coffee,weekly.long];
      this.checkweeklyData = Observable.of(true); 
      this.showProgress = false;

    },error => {
      toastr.error(error.message);
      this.showProgress = false ;
    })

  }

  getMonthlyData(date: any){

    this.showProgress = true;
    var dateOffset = this.dayOffset * 30; //30 days
    let myDate = new Date(this.getDate(date));
    this.month.start = new Date(this.getDate(date)).getTime();
    this.month.end =  myDate.setTime(myDate.getTime() - dateOffset);

    let monthly: any = {
      pomdoro: 0,
      short: 0,
      coffee: 0,
      long: 0
    };
  
    this.logService.getMonthlyLogsList(this.month.start + this.dayOffset,this.month.end,this.userId).subscribe(data=>{
      data.forEach(element => {
        if(element.type == 'pomodoro'){
          // this.daily.pomodoro[counter]= element;
          monthly.pomdoro++;
        }else if(element.type == 'short break'){
          // this.daily.pomodoro[counter]= element;
          monthly.short++;
        }
        else if(element.type == 'coffee break'){
          // this.daily.pomodoro[counter]= element;
          monthly.coffee++;
        }
        else if(element.type == 'long break'){
          // this.daily.pomodoro[counter]= element;
          monthly.long++;
        }  
      });

      this.MonthlyChartData = [monthly.pomdoro,monthly.short,monthly.coffee,monthly.long];
      this.checkmonthlyData = Observable.of(true);
      this.showProgress = false;

    },error => {
      toastr.error(error.message);
      this.showProgress = false ;
    })

  }

  getActivityData(date:any){
    
    this.showProgress = true ;
    this.logData = this.logService.getLogsList(moment(this.getDate(date)).format('YYYY/MM/DD'),this.userId);
    this.logData.subscribe((x) => {
      let counter = 0;
      x.forEach(element => {
        if(element.type == 'pomodoro'){
          // this.daily.pomodoro[counter]= element;
          this.dailyPomodoro.push(element);
          ++counter;
        }  
      });
      this.cycles.pomodoro = counter;
      this.showProgress = false ;
      // console.log('pomdoro :'+this.dailyPomodoro);
    },error => {
      toastr.error(error.message);
      this.showProgress = false ;
    });
  }

  getDate(d: any): any{
    let date = d.year+"/"+d.month+"/"+d.day;
    return date;
  }

  selectToday() {
    this.dateSelected = {year: now.year(), month: now.month() + 1, day: now.date() };
    this.getActivityData(this.dateSelected);
    this.getWeeklyData(this.dateSelected);
    this.getMonthlyData(this.dateSelected);
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
    this.getWeeklyData(this.dateSelected);
    this.getMonthlyData(this.dateSelected);
    
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
