/// <reference path="../../assets/js/toastr.d.ts" />

import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild, ViewEncapsulation, HostListener, OnDestroy } from '@angular/core';
import { CountdownComponent } from 'ngx-countdown';
import { FormControl, FormGroup, Validators, FormBuilder } from "@angular/forms";
import { TimerService } from "./shared/timer.service";
import { AuthService } from "./../core/auth.service";
import { fadeInAnimation } from "./../shared/fadein.animation";
import { Observable } from 'rxjs/Observable';
import { NotifyService } from './../core/notify.service';

import { Config } from "ngx-countdown";


// import { PushNotificationsService } from 'angular2-notifications'; //import the service

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
  notification_val: string = "off";
  notify: string;
  projects: any;
  loadingSpinner: boolean;
  tS: any;
  tm: Observable<boolean>;
  timerIdle: boolean = true;
  result: boolean;
  // countDown = { "pomodoro": 1500, "short": 300, "coffee": 600, "long": 1800 }
  countDown = { "pomodoro": 6, "short": 6, "coffee": 5, "long": 4}
  timerStatus: boolean;
  getCountDown: any;
  togglePomodoroTimerButton: boolean = false;
  toggleShortTimerButton: boolean = true;
  toggleLongTimerButton: boolean = false;
  toggleCoffeeTimerButton: boolean = false;
  toggleBreakTimerButton: boolean = false;
  toggleMeetingTimerButton: boolean = false;
  processValidation: boolean = false;
  timer: number = 1000 * 60 * 25;
  currentTime: any;
  pomodoroCounter: any;
  pCounter: any;
  pomodoroTodo: number = 1;
  breakText : string = "Breaks";
  selectConfig = {
    displayKey:"displayName", //if objects array passed which key to be displayed defaults to description,
    search: true//enables the search plugin to search in the list
  }
  meetingAgenda: string = '';
  talklean: string = '';
  users: any = [];
  userSelected: any=[];

  @ViewChild('cd1') cd1: CountdownComponent;
  @ViewChild('cd2') cd2: CountdownComponent;
  @ViewChild('cd3') cd3: CountdownComponent;
  @ViewChild('cd4') cd4: CountdownComponent;
  @ViewChild('cd5') cd5: CountdownComponent;

  pomodoroForm = new FormGroup({
    task: new FormControl({ value: '', disabled: false }, Validators.required),
    project: new FormControl({ value: 'Choose a Project', disabled: false }, Validators.required)
  });

  constructor(private timerService: TimerService, private notifyService: NotifyService) {


    this.projects = this.timerService.getProjects();
    this.getCountDown = this.timerService.getSettings();
    this.tS = this.timerService.timerStatusCheck();
    this.pomodoroCounter = this.timerService.getTodayPomodoroCount();

  }


  ngOnInit() {

    this.loadingSpinner = true;

    this.projects.subscribe(x => {
      // success data operations
    }, error => console.log(error));

    this.tS.subscribe(user => {
      this.tm = Observable.of(user.timerStatus && this.timerIdle);
    })

    this.pomodoroCounter.subscribe(counter => this.pCounter =  counter + 1,error => console.log(error));

    this.getCountDown.subscribe(x => {
      this.countDown = { "pomodoro": x.pomodoro * 60, "short": x.short * 60, "coffee": x.coffee * 60, "long": x.long * 60 }
      this.loadingSpinner = false;
    }, error => console.log(error))

    this.timerService.getAllEmployees().subscribe(users => {
      this.users = users;
    })
    
    this.timerService.currentStatus.subscribe(status => {
      this.timerStatus = status;
    })

    $('[data-toggle="tooltip"]').tooltip();
    this.requestPermission();

  }

  ngAfterViewInit() {
    // this.timerService.postToSlack('*Hello Again from EMS*');
  }

  ngAfterViewChecked() {

  }

  ngOnDestroy() {
    if (this.timerIdle == false) {
      this.timerIdle = true;
      this.timerService.updateTimerStatus(false);
    }
    this.timerService.changeTimerStatus(false);
  }

  pomodoroDecrement(){
    if(this.pomodoroTodo == 1){
      toastr.clear();
      toastr.warning("At least one pomodoro is necessary for this task.");
      return;
    }
    this.pomodoroTodo--;
  }

  pomodoroIncrement(){
    if(this.pomodoroTodo == 8){
      toastr.clear();
      toastr.warning("You can't set more than 8 pomodoro for single task.");
      return;
    }
    this.pomodoroTodo++;
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


  requestPermission() {
    if ('Notification' in window) {
      let self = this;

      try {
        Notification.requestPermission()
          .then(function (permission) {
            permission == "granted" ? self.notification_val = 'on' : self.notification_val = 'off';
          })
      } catch (error) {
        // Safari doesn't return a promise for requestPermissions and it                                                                                                                                       
        // throws a TypeError. It takes a callback as the first argument                                                                                                                                       
        // instead.
        if (error instanceof TypeError) {
          Notification.requestPermission(() => {
            self.notification_val = 'on';
          })
        } else {
          throw error;
        }
      }
    }

  }


  onExit() {
    console.log('closing');
    if (this.timerIdle == false) {
      this.timerService.updateTimerStatus(false);
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.altKey && event.keyCode === 80) {
      // this.increment
      $('a[href="#pomodoro"]').tab('show');
    }
    else if (event.altKey && event.keyCode === 83) {
      // this.increment
      $('a[href="#short-break"]').tab('show');
    }
    else if (event.altKey && event.keyCode === 67) {
      // this.increment
      $('a[href="#coffee-break"]').tab('show');
    }
    else if (event.altKey && event.keyCode === 76) {
      // this.increment
      $('a[href="#long-break"]').tab('show');
    }
    else if (event.keyCode === 32) {
      // this.increment
      // console.log('Space');
    }

  }


  inputFocus(e: any) {
    $(e.target).parent().addClass('input--filled');
  }

  inputFocusOut(e: any) {
    if ($(e.target).val() == "") {
      $(e.target).parent().removeClass('input--filled');
    }
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

  startBreak(counter: CountdownComponent){
    
    this.notifyService.clear();
    this.restart(this.cd1);
    this.restart(this.cd5);

    this.toggleBreakTimerButton = true;
  
    // this.restart(counter);
    if(counter == this.cd2){

      console.log('Short');
      this.breakText = "Short Break";
      this.toggleShortTimerButton = true;
      this.toggleCoffeeTimerButton = false;
      this.toggleLongTimerButton = false;

    }
    if(counter == this.cd3){
      console.log('coffee');
      this.breakText = "Coffee Break";
      this.toggleCoffeeTimerButton = true;
      this.toggleShortTimerButton = false;
      this.toggleLongTimerButton = false;

    }
    if(counter == this.cd4){
      console.log('long');
      this.breakText = "Long Break";
      this.toggleCoffeeTimerButton = false;
      this.toggleShortTimerButton = false;
      this.toggleLongTimerButton = true;
    }

    counter.begin();

    this.timerService.changeTimerStatus(true);
    this.timerService.updateTimerStatus(true);
    this.timerIdle = false;
  }

  begin(counter: CountdownComponent) {

    this.notifyService.clear();
    this.beginTimer(counter);

  }

  beginMeeting(counter: CountdownComponent){
    
    if(this.meetingAgenda == ''){
      toastr.clear();
      toastr.warning('Write an agenda for Meeting.')
      return;
    } 
    if( this.userSelected.length <= 1 ){
      toastr.clear();
      toastr.warning('Please select more than 1 Participants of Meeting')
      return;
    }

    this.notifyService.clear();
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
        this.restart(this.cd5);
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
    this.restart(this.cd5);
    counter.begin();

    if (counter == this.cd1)
      this.togglePomodoroTimerButton = true;
    else if (counter == this.cd2)
      this.toggleShortTimerButton = true;
    else if (counter == this.cd3)
      this.toggleCoffeeTimerButton = true;
    else if (counter == this.cd4)
      this.toggleLongTimerButton = true;
    else if (counter == this.cd5)
      this.toggleMeetingTimerButton = true;

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
      this.toggleShortTimerButton = true
    }
    else if(counter == this.cd5){
      this.toggleShortTimerButton = true
    }
    else{
      
      counter == this.cd2 ? this.toggleShortTimerButton = true : this.toggleShortTimerButton = false;
   
    }

    this.togglePomodoroTimerButton = false;
    this.toggleMeetingTimerButton = false;
    counter == this.cd3 ? this.toggleCoffeeTimerButton = true : this.toggleCoffeeTimerButton = false;
    counter == this.cd4 ? this.toggleLongTimerButton = true : this.toggleLongTimerButton = false;    
    this.toggleBreakTimerButton = false;
    this.breakText = "Breaks";

    let minutes = <number>counter.config.leftTime / 60;
    if (minutes < 10)
      $('.' + counter.config.className).find('span.hand.hand-m').html('<span class="digital digital-0 ">0</span><span class="digital digital-' + minutes.toString()[0] + ' ">' + minutes.toString()[0] + '</span>');
    else
      $('.' + counter.config.className).find('span.hand.hand-m').html('<span class="digital digital-' + minutes.toString()[0] + ' ">' + minutes.toString()[0] + '</span><span class="digital digital-' + minutes.toString()[1] + ' ">' + minutes.toString()[1] + '</span>');
    $('.' + counter.config.className).find('span.hand.hand-s').html('<span class="digital digital-0 ">0</span><span class="digital digital-0 ">0</span>');
    counter.config.leftTime = <number>counter.config.leftTime + 0.1;

    counter.restart();


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
    this.toggleBreakTimerButton = false;
    this.toggleMeetingTimerButton = false;

    this.breakText = "Breaks";

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

    this.notifySound(content.type);

    if(this.pomodoroTodo <= 1) {

      this.notifyService.update("Your Pomodoro Cycle is finished, you can now take a Short Break", "success");
      this.pomodoroTodo = 1;
      this.togglePomodoroTimerButton = false;
      this.restart(counter);
      this.processValidation = false;
      this.pomodoroForm.reset();
    
    }
    else{

      setTimeout(()=> {
        this.begin(counter)
      },2000);
      
      this.pomodoroTodo--;
    
    }

  }

  onFinishedSB(counter: any) {

    this.restart(counter);
    // counter.restart();
    let content: any = { type: "short break", task: '', project: '', duration: 5, fullCycle: true }
    this.timerService.createLog(content);
    this.toggleShortTimerButton = true;
    this.notifySound(content.type);

    this.notifyService.update("Your Short Break is finished, you can now start A Pomodoro Cycle", "success");
  }

  onFinishedCB(counter: any) {

    let content: any = { type: "coffee break", task: '', project: '', duration: 10, fullCycle: true }
    this.timerService.createLog(content);
    this.restart(counter);
    this.toggleCoffeeTimerButton = true;
    this.notifySound(content.type);

    this.notifyService.update("Your Coffee Break is finished, you can now start A Pomodoro Cycle", "success");

  }

  onFinishedLB(counter: any) {

    let content: any = { type: "long break", task: '', project: '', duration: 30, fullCycle: true }
    this.timerService.createLog(content);
    this.restart(counter);
    this.toggleLongTimerButton = true;
    this.notifySound(content.type);

    this.notifyService.update("Your Long Break is finished, you can now start A Pomodoro Cycle", "success");

  }

  onFinishedMeeting(counter: any) {
    let content: any = {
      type: "meeting",
      task: this.meetingAgenda,
      talklean: this.talklean,
      fullCycle: true,
      duration: 25
    }

    let slackMessage = `*Meeting Agenda: *\n${this.meetingAgenda}\n\n*Meeting Participants:*\n`;

    this.userSelected.map( (user) => {
      this.timerService.saveLog(user.uid , content);
      slackMessage = slackMessage +  `${user.displayName}, `
    })

    slackMessage = slackMessage + `\n\n*Meeting Points*:\n${this.talklean}`;

    this.timerService.postToSlack(encodeURI(slackMessage));
    
    // this.timerService.createLog(content);
    this.restart(counter);
    this.meetingAgenda = '';
    this.talklean = '';
    this.userSelected = [];
    this.toggleBreakTimerButton = false;
    this.notifySound(content.type);

  }


  notifySound(type) {


    if ('Notification' in window && Notification.permission == 'granted') {
      // We would only have prompted the user for permission if new
      // Notification was supported (see below), so assume it is supported.
      var notification = new Notification("Nordicomm EMS", {
        icon: 'favicon.png',
        body: "Hey there! Your Timer for " + type + " is over",
      });

      notification.onclick = function (event) {
        // event.preventDefault(); // prevent the browser from focusing the Notification's tab
        window.open('https://nordicomm.co/ems/#/timer');
        notification.close();

      }

    } else if (this.isNewNotificationSupported()) {
        // new Notification is supported, so prompt the user for permission.f
      // ServiceWorkerRegistration
     }


    if (localStorage.getItem('sound'))
      var sound = localStorage.getItem('sound');
    else
      var sound = "Sound 1";

    var audio = new Audio('assets/sounds/' + sound + '.ogg');

    let promise = audio.play();

    if (promise !== undefined) {

      promise.then(_ => {

        // console.log('audio played')
        // Autoplay started!

      }).catch(error => {
        console.log(error);
      });

    }

    this.timerService.updateTimerStatus(false);
    this.timerService.changeTimerStatus(false);
    this.timerIdle = true;

  }

  isNewNotificationSupported() {
  
    if (!("Notification" in window) || !Notification.requestPermission) {
      alert("This browser does not support desktop notification");
      return false;
    }
    if (Notification.permission == 'granted')
        throw new Error('You must only call this *before* calling Notification.requestPermission(), otherwise this feature detect would bug the user with an actual notification!');
    try {
      this.requestPermission();
    } catch (e) {
        if (e.name == 'TypeError')
            return false;
    }
    return true;
  }

  // handleChange(num: number) {

  //   // Let's check if the browser supports notifications
  //   if (!("Notification" in window)) {
  //     alert("This browser does not support desktop notification");
  //     return;
  //   }
  //   else {
  //     this.requestPermission();
  //   }

  // }

}
