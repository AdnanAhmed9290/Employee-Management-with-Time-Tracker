/// <reference path="../../assets/js/toastr.d.ts" />

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CountdownComponent } from 'ngx-countdown';

declare var $: any;
declare var Notification: any;

@Component({
  selector: 'timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, AfterViewInit  {

  model: any;
  notification_val: String;
  notify: string;
  disableFields: boolean = false;
  toggleButtonTimer: boolean = false;

  countDown = {
    "pomodoro": 1500,
    "short": 300,
    "coffee": 600,
    "long": 1800,
  }

  constructor() {
    this.notify = Notification.permission;
    this.notify == "granted" ? this.notification_val = "on" : this.notification_val = "off";
  }

  ngOnInit() {

  }

  ngAfterViewInit(){
    // $('a[data-toggle="tab"]').on('show.bs.tab', function (e:any) {
    //   console.log(e); // newly activated tab
    //   console.log(e.target.dataset.tab);
    //   // console.log(e.relatedTarget) // previous active tab
    // })
  }

  tabs(counter: CountdownComponent){
    // setTimeout(function(){
      
    // },100);
    this.restart(counter);
    counter.begin();
    this.toggleButtonTimer = true;
  }

  start(counter: CountdownComponent) {
    // toastr.info("Timer Started");
    // console.log(counter);
  }

  begin(counter: CountdownComponent) {
    this.disableFields = true;
    counter.begin();
    this.toggleButtonTimer = true;
    // let minutes =<number> counter.config.leftTime / 60;
    // $('.'+counter.config.className).find('span.hand.hand-m').html('<span class="digital digital-2 ">2</span><span class="digital digital-4 ">4</span>');
  }

  restart(counter: CountdownComponent){

      let minutes =<number> counter.config.leftTime / 60;
      if(minutes < 10)
          $('.'+counter.config.className).find('span.hand.hand-m').html('<span class="digital digital-0 ">0</span><span class="digital digital-'+minutes.toString()[0]+' ">'+minutes.toString()[0]+'</span>');
      else
          $('.'+counter.config.className).find('span.hand.hand-m').html('<span class="digital digital-'+minutes.toString()[0]+' ">'+minutes.toString()[0]+'</span><span class="digital digital-'+minutes.toString()[1]+' ">'+minutes.toString()[1]+'</span>');
      $('.'+counter.config.className).find('span.hand.hand-s').html('<span class="digital digital-0 ">0</span><span class="digital digital-0 ">0</span>');
      counter.config.leftTime = <number> counter.config.leftTime + 0.1;
      counter.restart();
      this.toggleButtonTimer = false;
      counter.config.leftTime = <number> counter.config.leftTime - 0.1;

  }

  onFinished() {
    toastr.info("Timer Finished");
  }

  handleChange(num: number) {

    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied" && this.notification_val == "on") {
        Notification.requestPermission(function (permission: any) {
        });
    }
  }

}
