import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';

import * as moment from 'moment';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseListObservable } from "angularfire2/database-deprecated";
import { AngularFireAuth } from 'angularfire2/auth';

import { Log } from "./activity";

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class ActivityLogsService {

  LogsCollection: AngularFirestoreCollection<Log>;
  LogsDocument:   AngularFirestoreDocument<Log>;

  
  userId : String ;
  Logs: AngularFireList<Log []>;
  L : FirebaseListObservable<Log []>;
  // itemsRef: AngularFireList<Item>;
  // itemRef:  AngularFireObject<Item>;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private afs: AngularFirestore) {
      if(this.afAuth)
        this.userId = this.afAuth.auth.currentUser.uid; 
  }

   // Return an observable list with optional query
  // You will usually call this from OnInit in a component
  
  getLogsList(date: string): Observable<Log []> {

    if (!this.userId) return Observable.of();
    // return this.db.list(`logs/0nwUHJQ5D9dJ6gC1LFvUgQ6aDPc2`).snapshotChanges().map((arr) => {
    // return this.db.list(`logs/${this.userId}`).snapshotChanges().map((arr) => {
    //   return arr.map((snap) => Object.assign(snap.payload.val(), { $key: snap.key }) );
    // });

    this.LogsCollection = this.afs.collection<Log>('users/'+this.userId+'/logs', 
      ref => ref.where('date', '==', date).where('fullCycle','==', true)
      .orderBy('createdAt',"desc"));
    return this.LogsCollection.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Log;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });


  }

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp()
  }

  // createLog(log: any)  {
  //   // const timestamp = this.timestamp
  //   let now = moment();
  //   let start = moment().subtract(log.duration, 'm');
  //   const userRef: AngularFirestoreCollection<any> = this.afs.collection(`users/`).doc(''+this.userId+'/').collection('logs');
  //   userRef.add({
  //     ...log,
  //     startAt: start.format(),
  //     createdAt: now.format(),
  //     date: now.format('YYYY/MM/DD') 
  //   });
  //   // this.db.list(`logs/${this.userId}`).push(log);
  // }

}
