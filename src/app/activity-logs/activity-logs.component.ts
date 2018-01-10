/// <reference path="../../assets/js/toastr.d.ts" />

import { Component, OnInit } from '@angular/core';
import { fadeInAnimation} from "./../shared/fadein.animation";
import {NgbDateStruct, NgbCalendar, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { ActivityLogsService } from './shared/activity-logs.service';

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
  content : any = {
    title: "new data"
    // type: "pomodoro",
    // task: "BabywinK UI Dev",
    // project: "Babywink Web",
    // date: "2018/01/10",
    // startTime: new Date(),
    // endTime: new Date()
  }

  constructor(private logService: ActivityLogsService) {
    this.logData = this.logService.getLogsList();
  }

  create(){
    console.log(this.content);
    this.logService.createLog(this.content);
  }

  ngOnInit() {

    this.logData.subscribe((x) => {
      console.log(this.logData);
      this.showSpinner = false;
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


}
