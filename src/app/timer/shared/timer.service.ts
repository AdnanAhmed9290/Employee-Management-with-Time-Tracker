import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';

import { AsyncLocalStorage } from 'angular-async-local-storage';

import { AngularFireAuth } from 'angularfire2/auth';

import { Log } from "./../../activity-logs/shared/activity";
import { Observable } from 'rxjs/Observable';


import { Http, Headers, Response } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

interface User {
  uid: string;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
  timerStatus?: boolean;
}

@Injectable()
export class TimerService {

  projectCollection: AngularFirestoreCollection<Log>;
  timerDocument:   AngularFirestoreDocument<Log>;

  userId : String ;

  private timerSource = new BehaviorSubject<boolean>(false);
  currentStatus = this.timerSource.asObservable();


  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, public als: AsyncLocalStorage
    ,private http: Http) {

    window.onbeforeunload = function (e) {
      var e = e || window.event;
    
      //IE & Firefox
      if (e) {
        e.returnValue = 'Are you sure?';
      }
    
      // For Safari
      return 'Are you sure?';
    };
  }

  
  changeTimerStatus(status: boolean) {
    this.timerSource.next(status)
  }

   // Return an observable list with optional query
  // You will usually call this from OnInit in a component
  
  getProjects(): Observable<any> {
      
      this.projectCollection = this.afs.collection<any>('projects');
      // .valueChanges() is simple. It just returns the 
      // JSON data without metadata. If you need the 
      // doc.id() in the value you must persist it your self
      // or use .snapshotChanges() instead.
      return this.projectCollection.valueChanges();
  
    }


  getSettings(): Observable<any>{
      this.timerDocument = this.afs.collection<any>('settings').doc('timer');
      // .valueChanges() is simple. It just returns the 
      // JSON data without metadata. If you need the 
      // doc.id() in the value you must persist it your self
      // or use .snapshotChanges() instead.
      return this.timerDocument.valueChanges();
  }

  timerStatusCheck(): Observable<any>{
    if(this.afAuth)
      return this.afs.collection<any>('users').doc(this.afAuth.auth.currentUser.uid).valueChanges();
      //return  this.afs.doc<any>(`users/${this.afAuth.auth.currentUser.uid}`).valueChanges();
    else
      return Observable.of(null);  
  }

  updateTimerStatus(status: boolean){
    
    let user = this.afAuth.auth.currentUser;
    // return this.http.get('localhost:3000/timerFalse/'+user.uid);
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      timerStatus: status
    };
    return userRef.update(data);
  }

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp()
  }

  createLog(log: any)  {
    if(this.afAuth)
      this.userId = this.afAuth.auth.currentUser.uid; 
    let now = moment();
    let start = moment().subtract(log.duration, 'm');
    const userRef: AngularFirestoreCollection<any> = this.afs.collection(`users/`).doc(''+this.userId+'/').collection('logs');
    userRef.add({
      ...log,
      startAt: start.format(),
      createdAt: now.format(),
      date: now.format('YYYY/MM/DD') 
    })
    .then( x => toastr.success('Activity Log Saved') )
    .catch( error => this.handleError(error));
  }

   // If error, console log and notify user
   private handleError(error: Error) {
    toastr.error(error.message);
    console.log(error);
    // this.notify.update(error.message, 'error');
  }

}
