import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';
import { Log } from './../../activity-logs/shared/activity'; 
import { User } from './../../core/user';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ReportService {

  LogsCollection: AngularFirestoreCollection<Log>;
  LogsDocument:   AngularFirestoreDocument<Log>;
  // userId : String ;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore,private afm: AngularFirestoreModule ) {

  }

  getCollection(): Observable<User[]>{
    const usersRef = this.afs.collection<User>(`users/`);
    return usersRef.valueChanges();
  }

  getLogs(user): Observable<any>{
    console.log(user);
    
    let pomodoro = this.afs.collection(`users/`+user.data.uid+`/logs`,ref => ref.where('date', '==', '2018/02/01').where('type','==', 'pomodoro')).snapshotChanges()
    .map(logs=>{
      console.log(logs.length);
      return logs.length;
    })

    return pomodoro;
  }

  getLogsList(date: any, user: any): Observable<Log []> {

    this.LogsCollection = this.afs.collection<Log>('users/'+user+'/logs', 
      ref => ref.where('date', '==', date)
      .orderBy('createdAt',"desc"));
    return this.LogsCollection.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Log;
        const id = action.payload.doc.id;
        // if(data.type == 'pomodoro'){

        // }
        return { id, ...data };
      });
    });
  }

  getWeeklyLogsList(start: any, end:any, user: any): Observable<Log []> {

    this.LogsCollection = this.afs.collection<Log>('users/'+user+'/logs'
      ,ref => ref.where('timeStamp', '<', start).where('timeStamp', '>', end));
    return this.LogsCollection.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Log;
        const id = action.payload.doc.id;
        // this.afs.doc('users/'+user+'/logs/'+id).update({
        //   timeStamp: new Date(data.createdAt).getTime()
        // })
        return { id, ...data };
      });
    });
  }

  getMonthlyLogsList(start: any, end:any, user: any): Observable<Log []> {

    this.LogsCollection = this.afs.collection<Log>('users/'+user+'/logs', 
      ref => ref.where('timeStamp', '<', start).where('timeStamp', '>', end));
    return this.LogsCollection.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Log;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  getAllEmployees(): Observable<any>{
    return this.afs.collection('users/').snapshotChanges().map(users => {
      return users.map(user =>{
        const data = user.payload.doc.data();
        const id = user.payload.doc.id;

        return {id, ...data};
        // this.afs.collection(`users/`+id+`/logs`, ref => ref.where('data','==','2018/04/10'))

      })
    })
  }

  getReportOfAllEmployees(userId, start): Observable<any>{

    console.log(start);
    // let start = moment().subtract(1,'d').format('YYYY/MM/DD');
    console.log(start);
    return  this.afs.collection(`users/`+userId+`/logs`, 
    ref => ref.where('date','==',start).where('type','==','pomodoro').orderBy('createdAt',"desc")).snapshotChanges().map(logs=> {
      return logs.map(log => {
        const data = log.payload.doc.data();
        const task = data.task;
        const timeline = moment(data.startAt).format('h:mm a')+' - '+moment(data.createdAt).format('h:mm a');
        // const end = data.createdAt;
        const project = data.project;
        return {task,timeline,project};
      })

    });
  }

  getUser(userId){
    return this.afs.doc('users/'+userId).valueChanges();
  }

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp()
  }

   // If error, console log and notify user
   private handleError(error: Error) {
    toastr.error(error.message);
    console.log(error);
    // this.notify.update(error.message, 'error');
  }

}
