/// <reference path="../../assets/js/toastr.d.ts" />

import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild, ViewEncapsulation, HostListener, OnDestroy } from '@angular/core';
import { CountdownComponent } from 'ngx-countdown';
import { FormControl, FormGroup, Validators, FormBuilder } from "@angular/forms";
import { TimerService } from "./shared/timer.service";
import { AuthService } from "./../core/auth.service";
import { fadeInAnimation } from "./../shared/fadein.animation";
import { Observable } from 'rxjs/Observable';
import { NotifyService } from './../core/notify.service'

declare var $: any;
declare var Notification: any;

@Component({
  selector: 'timer',
  // moduleId: module.id.toString(),
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class TimerComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {

  model: any;
  notification_val: String;
  notify: string;
  projects: any;
  loadingSpinner: boolean;
  tS: any;
  tm: Observable<boolean>;
  timerIdle: boolean = true;
  result: boolean;
  // countDown = { "pomodoro": 1500, "short": 300, "coffee": 600, "long": 1800 }
  countDown = { "pomodoro": 6, "short": 6, "coffee": 5, "long": 4 }
  timerStatus: boolean;
  // countDown: any;
  getCountDown: any;
  togglePomodoroTimerButton: boolean = false;
  toggleShortTimerButton: boolean = false;
  toggleLongTimerButton: boolean = false;
  toggleCoffeeTimerButton: boolean = false;
  processValidation: boolean = false;
  timer: number = 1000*60*25;
  currentTime: any;

  @ViewChild('cd1') cd1: CountdownComponent;
  @ViewChild('cd2') cd2: CountdownComponent;
  @ViewChild('cd3') cd3: CountdownComponent;
  @ViewChild('cd4') cd4: CountdownComponent;

  pomodoroForm = new FormGroup({
    task: new FormControl({ value: '', disabled: false }, Validators.required),
    project: new FormControl({ value: 'Choose a Project', disabled: false }, Validators.required)
  });

  constructor(private timerService: TimerService, private notifyService: NotifyService) {

    this.notify = Notification.permission;
    this.notify == "granted" ? this.notification_val = "on" : this.notification_val = "off";
    this.projects = this.timerService.getProjects();
    this.getCountDown = this.timerService.getSettings();
    this.tS = this.timerService.timerStatusCheck();

  }


  // @HostListener('window:unload', [ '$event' ])
  // unloadHandler(event) {
  //   this.onExit();
  //   return null;
  // }

  // @HostListener('window:beforeunload', ['$event'])
  // beforeUnloadHander(event) {
  //   this.onExit();
  //   return null;
  // }

  onExit(){
    console.log('closing');
    if (this.timerIdle == false) {
      this.timerService.updateTimerStatus(false);
    }
  }

  // @HostListener("keydown.esc")
  // public onEsc() {
  //   alert('escape');
  // }


  ngOnInit() {

    this.loadingSpinner = true;

    this.projects.subscribe(x => {
      // success data operations
    }, error => console.log(error));

    this.tS.subscribe(user => {
      this.tm = Observable.of(user.timerStatus && this.timerIdle);
    })

    this.getCountDown.subscribe(x => {
      this.countDown = { "pomodoro": x.pomodoro * 60, "short": x.short * 60, "coffee": x.coffee * 60, "long": x.long * 60 }
      this.loadingSpinner = false;
    }, error => console.log(error))

    this.timerService.currentStatus.subscribe(status => {
      this.timerStatus = status;
    })

  }

  ngAfterViewInit(){
    if (Notification.permission !== "granted")
      Notification.requestPermission();
  }

  ngAfterViewChecked() {

  }

  ngOnDestroy() {
    if (this.timerIdle == false) {
      this.timerIdle = true;
      this.timerService.updateTimerStatus(false);
    }
    this.timerService.changeTimerStatus(false);
    // this.getCountDown.unsubscribe();
    // this.tS.unsubscribe();
    // this.projects.unsubscribe();
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

    // this.restart(this.cd1);
    // this.restart(this.cd2);
    // this.restart(this.cd3);
    // this.restart(this.cd4);

    // if (counter != this.cd1) {
    //   setTimeout(function () {
    //     counter.begin();
    //   }, 600);
    //   this.timerService.updateTimerStatus(true)
    //   this.timerService.changeTimerStatus(true);
    //   this.timerIdle = false;
    //   this.toggleButtonTimer = true;
    // }

  }

  onStart() {
    // console.log("timer started");
  }

  stop(counter: CountdownComponent) {
    counter.stop();
    this.timerService.updateTimerStatus(false);
    this.timerIdle = true;
    this.timerService.changeTimerStatus(false);
  }

  onStop(counter: CountdownComponent) {
    counter.stop();
    let task = this.pomodoroForm.get('task').value;
    let project = this.pomodoroForm.get('project').value;

    let content: any = {
      type: "pomodoro",
      task: task,
      project: project,
      fullCycle: false,
      duration: <number>counter.config.leftTime / 60
    }

    // this.notifySound(content.type);

    this.timerService.createLog(content);
    this.timerService.updateTimerStatus(false);
    this.timerService.changeTimerStatus(false);
    this.timerIdle = true;
    this.restart(counter);
    this.togglePomodoroTimerButton = false;
    this.processValidation = false;
    this.pomodoroForm.reset();
  }

  begin(counter: CountdownComponent) {

    // if (this.timerIdle == false) {
    //   if(confirm("Are you sure")){
    //     this.beginTimer(counter);
    //   }
    //   else
    //     return;

    // } else {
    //   this.beginTimer(counter);
    // }

    this.beginTimer(counter);
  }


  beginTimer(counter: CountdownComponent) {
    if (counter == this.cd1) {
      this.processValidation = true;
      this.reset(counter);

      if (this.pomodoroForm.invalid) {
        this.restart(this.cd2);
        this.restart(this.cd3);
        this.restart(this.cd4);
        return; //Validation Failed, exit from method
      }

      this.pomodoroForm.controls['task'].disable();
      this.pomodoroForm.controls['project'].disable();

    }
    else {
      this.restart(this.cd1);
    }

    this.restart(this.cd2);
    this.restart(this.cd3);
    this.restart(this.cd4);

    counter.begin();

    if (counter == this.cd1)
      this.togglePomodoroTimerButton = true;
    else if (counter == this.cd2)
      this.toggleShortTimerButton = true;
    else if (counter == this.cd3)
      this.toggleCoffeeTimerButton = true;
    else
      this.toggleLongTimerButton = true;

    this.timerService.changeTimerStatus(true);
    this.timerService.updateTimerStatus(true);
    this.timerIdle = false;

  }

  restart(counter: CountdownComponent) {

    if (counter == this.cd1) {
      this.processValidation = false;
      this.pomodoroForm.reset();
      this.pomodoroForm.controls['task'].enable();
      this.pomodoroForm.controls['project'].enable();
    }


    let minutes = <number>counter.config.leftTime / 60;
    if (minutes < 10)
      $('.' + counter.config.className).find('span.hand.hand-m').html('<span class="digital digital-0 ">0</span><span class="digital digital-' + minutes.toString()[0] + ' ">' + minutes.toString()[0] + '</span>');
    else
      $('.' + counter.config.className).find('span.hand.hand-m').html('<span class="digital digital-' + minutes.toString()[0] + ' ">' + minutes.toString()[0] + '</span><span class="digital digital-' + minutes.toString()[1] + ' ">' + minutes.toString()[1] + '</span>');
    $('.' + counter.config.className).find('span.hand.hand-s').html('<span class="digital digital-0 ">0</span><span class="digital digital-0 ">0</span>');
    counter.config.leftTime = <number>counter.config.leftTime + 0.1;

    counter.restart();
    this.togglePomodoroTimerButton = false;
    this.toggleShortTimerButton = false;
    this.toggleLongTimerButton = false;
    this.toggleCoffeeTimerButton = false;

    counter.config.leftTime = <number>counter.config.leftTime - 0.1;
    this.timerService.changeTimerStatus(false);
    this.timerService.updateTimerStatus(false);
    this.timerIdle = true;

  }

  reset(counter: CountdownComponent) {
    let minutes = <number>counter.config.leftTime / 60;
    if (minutes < 10)
      $('.' + counter.config.className).find('span.hand.hand-m').html('<span class="digital digital-0 ">0</span><span class="digital digital-' + minutes.toString()[0] + ' ">' + minutes.toString()[0] + '</span>');
    else
      $('.' + counter.config.className).find('span.hand.hand-m').html('<span class="digital digital-' + minutes.toString()[0] + ' ">' + minutes.toString()[0] + '</span><span class="digital digital-' + minutes.toString()[1] + ' ">' + minutes.toString()[1] + '</span>');
    $('.' + counter.config.className).find('span.hand.hand-s').html('<span class="digital digital-0 ">0</span><span class="digital digital-0 ">0</span>');
    counter.config.leftTime = <number>counter.config.leftTime + 0.1;

    counter.restart();

    this.togglePomodoroTimerButton = false;
    this.toggleShortTimerButton = false;
    this.toggleLongTimerButton = false;
    this.toggleCoffeeTimerButton = false;

    counter.config.leftTime = <number>counter.config.leftTime - 0.1;
    this.timerService.changeTimerStatus(false);
    this.timerService.updateTimerStatus(false);
    this.timerIdle = true;
  }

  onFinishedPomodoro(counter: any) {


    let task = this.pomodoroForm.get('task').value;
    let project = this.pomodoroForm.get('project').value;

    let content: any = {
      type: "pomodoro",
      task: task,
      project: project,
      fullCycle: true,
      duration: 25
    }

    this.timerService.createLog(content);
    this.restart(counter);

    this.togglePomodoroTimerButton = false;

    this.processValidation = false;
    this.pomodoroForm.reset();
    this.notifySound(content.type);

    this.notifyService.update("Your Pomodoro Cycle is finished, you can now take a Short Break","success");

  }

  onFinishedSB(counter: any) {

    this.restart(counter);
    // counter.restart();
    let content: any = { type: "short break", task: '', project: '', duration: 5, fullCycle: true }
    this.timerService.createLog(content);
    this.toggleShortTimerButton = false;
    this.notifySound(content.type);

    this.notifyService.update("Your Short Break is finished, you can now start A Pomodoro Cycle","success");
  }

  onFinishedCB(counter: any) {

    let content: any = { type: "coffee break", task: '', project: '', duration: 10, fullCycle: true }
    this.timerService.createLog(content);
    this.restart(counter);
    this.toggleCoffeeTimerButton = false;
    this.notifySound(content.type);
    
    this.notifyService.update("Your Coffee Break is finished, you can now start A Pomodoro Cycle","success");

  }

  onFinishedLB(counter: any) {

    let content: any = { type: "long break", task: '', project: '', duration: 30, fullCycle: true }
    this.timerService.createLog(content);
    this.restart(counter);
    this.toggleLongTimerButton = false;
    this.notifySound(content.type);
    
    this.notifyService.update("Your Long Break is finished, you can now start A Pomodoro Cycle","success");

  }

  notifySound(type) {

    if (Notification.permission !== "granted")
      Notification.requestPermission();
    var notification = new Notification("Nordicomm EMS", {
      icon: 'favicon.png',
      body: "Hey there! Your Timer for " + type + " is over",
    });

    notification.onclick = function(event) {
      // event.preventDefault(); // prevent the browser from focusing the Notification's tab
      window.open('https://nordicomm.co/ems/#/timer');
      notification.close();

    }


    if (localStorage.getItem('sound'))
      var sound = localStorage.getItem('sound');
    else
      var sound = "Sound 1";

    var audio = new Audio('assets/sounds/' + sound + '.ogg');
    audio.play();

    this.timerService.updateTimerStatus(false);
    this.timerService.changeTimerStatus(false);
    this.timerIdle = true;

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
