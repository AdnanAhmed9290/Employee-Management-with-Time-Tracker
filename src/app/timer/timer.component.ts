/// <reference path="../../assets/js/toastr.d.ts" />

import { Component, OnInit } from '@angular/core';
import { CountdownComponent } from 'ngx-countdown';

declare var $ :any;

@Component({
  selector: 'timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  model;
  notify: boolean;
  constructor() {
    this.notify = Notification.permission;
    console.log(this.notify);

    this.model = {
      val : "on"
    }
  }

  ngOnInit() {
    
  }

  onStart(counter){
    // toastr.info("Timer Started");
    // console.log(counter);
  }

  begin(counter){
    // toastr.info("Timer Started");
    console.log(counter);
    counter.begin();
  }

  onFinished(){
    toastr.info("Timer Finished");
  }

}
