/// <reference path="../../assets/js/toastr.d.ts" />

import { Component, OnInit } from '@angular/core';
import { fadeInAnimation} from "./../shared/fadein.animation";
import {NgbDateStruct, NgbCalendar, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { ActivityLogsService } from './shared/activity-logs.service';

import * as moment from 'moment';

import { Observable } from 'rxjs/Observable';

import {Log} from "./shared/activity";

const now = new Date();

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
  dateSelected: any;
  maxDate: any;
  date: {year: number, month: number};
  maxDateFlag : boolean = true;
  cycles: number = 0;

  constructor(private logService: ActivityLogsService) {
    this.logData = this.logService.getLogsList(moment().format('YYYY/MM/DD'));
  }

  ngOnInit() {

    this.logData.subscribe((x) => {
      let counter = 0;
      x.forEach(element => {
        if(element.type == 'pomodoro')  
          ++counter;
      });
      this.cycles = counter;
      this.showSpinner = false;
      // this.noData = false;
    },error => {

      this.showSpinner = false ;
    });


    this.selectToday();
    this.maxDate =  this.dateSelected;


  }


  selectToday() {
    this.dateSelected = {date: now, year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  }

  subDate(){
    let currentDate = new Date(this.dateSelected.date);
    currentDate.setDate(currentDate.getDate() - 1);
    this.dateSelected = {date: currentDate, year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate()};
    // console.log(now+","+currentDate);
    this.maxDateFlag = false;
  }

  onDateChange(){
    console.log(this.dateSelected);
  }

  addDate(){
    let currentDate = new Date(this.dateSelected.date);
    currentDate.setDate(currentDate.getDate() + 1);
    this.dateSelected = {date: currentDate, year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate()};
    console.log(now+","+currentDate);
    if(this.dateSelected >= this.maxDate){
        this.maxDateFlag = true;
    }
  }

  createP(){
    let content : any = {
      type: "pomodoro",
      task: "Create Module Added",
      project: "Babywink Web",
      duration: 25
    }
    this.logService.createLog(content);
  }

  createS(){
    let content : any = {
      type: "short break",
      task: "",
      project: "",
      duration: 5
    }
    this.logService.createLog(content);
  }

  createC(){
    let content : any = {
      type: "coffee break",
      task: "",
      project: "",
      duration: 10
    }
    this.logService.createLog(content);
  }

  createL(){
    let content : any = {
      type: "long break",
      task: "",
      project: "",
      duration: 30
    }
    this.logService.createLog(content);
  }


}
