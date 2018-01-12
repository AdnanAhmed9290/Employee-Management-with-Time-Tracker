/// <reference path="../../assets/js/toastr.d.ts" />

import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CountdownComponent } from 'ngx-countdown';
import { FormControl, FormGroup, Validators, FormBuilder } from "@angular/forms";
import { TimerService } from "./shared/timer.service";

import { fadeInAnimation } from "./../shared/fadein.animation";

declare var $: any;
declare var Notification: any;

@Component({
  // selector: 'timer',
  moduleId: module.id.toString(),
  templateUrl: './timer.component.html',
  // styleUrls: ['./timer.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class TimerComponent implements OnInit, AfterViewInit {

  model: any;
  notification_val: String;
  notify: string;
  disableFields: boolean = false;
  // countDown = { "pomodoro": 1500, "short": 300, "coffee": 600, "long": 1800 }
  countDown = { "pomodoro": 30, "short": 10, "coffee": 20, "long": 40 }
  toggleButtonTimer: boolean = false;
  processValidation: boolean = false;

  @ViewChild('cd1') cd1: CountdownComponent;
  @ViewChild('cd2') cd2: CountdownComponent;
  @ViewChild('cd3') cd3: CountdownComponent;
  @ViewChild('cd4') cd4: CountdownComponent;

  pomodoroForm = new FormGroup({
    task: new FormControl('', Validators.required),
    project: new FormControl('', Validators.required)
  });

  constructor(private timerService: TimerService) {
    this.notify = Notification.permission;
    this.notify == "granted" ? this.notification_val = "on" : this.notification_val = "off";
  }

  ngOnInit() {

  }

  ngAfterViewInit() {

  }

  inputFocus(e: any) {
    $(e.target).parent().addClass('input--filled');
  }

  inputFocusOut(e: any) {
    if ($(e.target).val() == "") {
      $(e.target).parent().removeClass('input--filled');
    }
  }

  tabs(counter: CountdownComponent) {
    // setTimeout(function(){

    // },100);
    this.restart(this.cd1);
    this.restart(this.cd2);
    this.restart(this.cd3);
    this.restart(this.cd4);

    if (counter != this.cd1) {
      setTimeout(function () {
        counter.begin();
      }, 600);
      this.toggleButtonTimer = true;
    }

  }

  // start(counter: CountdownComponent) {
  //   console.log(this.projects);
  // }

  begin(counter: CountdownComponent) {

    if (counter == this.cd1) {
      this.processValidation = true;
      if (this.pomodoroForm.invalid) {
        return; //Validation Failed, exit from method
      }

    }
    this.disableFields = true;
    counter.begin();
    this.toggleButtonTimer = true;
    // let minutes =<number> counter.config.leftTime / 60;
    // $('.'+counter.config.className).find('span.hand.hand-m').html('<span class="digital digital-2 ">2</span><span class="digital digital-4 ">4</span>');
  }

  restart(counter: CountdownComponent) {

    this.processValidation = false;
    this.pomodoroForm.reset();
    this.disableFields = false;
    let minutes = <number>counter.config.leftTime / 60;
    if (minutes < 10)
      $('.' + counter.config.className).find('span.hand.hand-m').html('<span class="digital digital-0 ">0</span><span class="digital digital-' + minutes.toString()[0] + ' ">' + minutes.toString()[0] + '</span>');
    else
      $('.' + counter.config.className).find('span.hand.hand-m').html('<span class="digital digital-' + minutes.toString()[0] + ' ">' + minutes.toString()[0] + '</span><span class="digital digital-' + minutes.toString()[1] + ' ">' + minutes.toString()[1] + '</span>');
    $('.' + counter.config.className).find('span.hand.hand-s').html('<span class="digital digital-0 ">0</span><span class="digital digital-0 ">0</span>');
    counter.config.leftTime = <number>counter.config.leftTime + 0.1;
    counter.restart();
    this.toggleButtonTimer = false;
    counter.config.leftTime = <number>counter.config.leftTime - 0.1;

  }

  onFinishedPomodoro(counter:any) {
    

    let task = this.pomodoroForm.get('task').value;
    let project = this.pomodoroForm.get('project').value;

    if (Notification.permission !== "granted")
      Notification.requestPermission();
    var notification = new Notification(task, {
      icon: 'assets/images/nordicomm_logo_dark.png',
      body: "Hey there! Your Pomodoro task on " + project + " is finished",
    });

    var audio = new Audio('assets/sounds/definite.mp3');
    audio.play();

    let content: any = {
      type: "pomodoro",
      task: task,
      project: project,
      duration: 25
    }
    this.restart(counter);
    this.toggleButtonTimer = false;
    this.processValidation = false;
    this.pomodoroForm.reset();


  }

  onFinishedSB(counter:any) {



    if (Notification.permission !== "granted")
      Notification.requestPermission();
    var notification = new Notification("Timer Finished", {
      icon: 'assets/images/nordicomm_logo_dark.png',
      body: "Hey there! Your Short Break is over",
    });


    var audio = new Audio('assets/sounds/definite.mp3');
    audio.play();

    
    this.restart(counter);
    let content: any = { type: "short break", task: '', project: '', duration: 5 }
    this.timerService.createLog(content);
    
    this.toggleButtonTimer = false;
  }

  onFinishedCB(counter:any) {


    if (Notification.permission !== "granted")
      Notification.requestPermission();
    var notification = new Notification("Timer Finished", {
      icon: 'assets/images/nordicomm_logo_dark.png',
      body: "Hey there! Your Coffee Break is over",
    });


    var audio = new Audio('assets/sounds/definite.mp3');
    audio.play();

    let content: any = { type: "coffee break", task: '', project: '', duration: 10 }
    this.timerService.createLog(content);
    this.restart(counter);
    this.toggleButtonTimer = false;
  }

  onFinishedLB(counter:any) {

    if (Notification.permission !== "granted")
      Notification.requestPermission();
    var notification = new Notification("Timer Finished", {
      icon: 'assets/images/nordicomm_logo_dark.png',
      body: "Hey there! Your Long Break is over",
    });


    var audio = new Audio('assets/sounds/definite.mp3');
    audio.play();

    let content: any = { type: "long break", task: '', project: '', duration: 30 }
    this.timerService.createLog(content);
    this.restart(counter);
    this.toggleButtonTimer = false;
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
