import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';

import * as moment from 'moment';

import { AngularFireAuth } from 'angularfire2/auth';

import { Log } from "./../../activity-logs/shared/activity";
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class TimerService {

  // LogsCollection: AngularFirestoreCollection<Log>;
  // LogsDocument:   AngularFirestoreDocument<Log>;

  userId : String ;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
      if(this.afAuth)
        this.userId = this.afAuth.auth.currentUser.uid; 
  }

   // Return an observable list with optional query
  // You will usually call this from OnInit in a component
  

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp()
  }

  createLog(log: any)  {
    let now = moment();
    let start = moment().subtract(log.duration, 'm');
    const userRef: AngularFirestoreCollection<any> = this.afs.collection(`users/`).doc(''+this.userId+'/').collection('logs');
    userRef.add({
      ...log,
      startAt: start.format(),
      createdAt: now.format(),
      date: now.format('YYYY/MM/DD') 
    });
  }

}
