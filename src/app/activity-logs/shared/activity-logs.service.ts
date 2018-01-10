import { Injectable } from '@angular/core';

// import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseListObservable } from "angularfire2/database-deprecated";
import { AngularFireAuth } from 'angularfire2/auth';

import { Log } from "./activity";

// import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ActivityLogsService {

  // LogsCollection: AngularFirestoreCollection<Log>;
  // LogsDocument:   AngularFirestoreDocument<Log>;

  Logs: AngularFireList<Log []>;
  L : FirebaseListObservable<Log []>;
  // itemsRef: AngularFireList<Item>;
  // itemRef:  AngularFireObject<Item>;
  userId: string;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
        console.log(user.uid);
        this.userId = user.uid;
        
      // if(user) this.userId = user.uid
    })
    this.Logs = db.list('/logs');
  }

   // Return an observable list with optional query
  // You will usually call this from OnInit in a component
  getLogsList(): Observable<Log []> {
    // if (!this.userId) return;
    return this.db.list(`logs/0nwUHJQ5D9dJ6gC1LFvUgQ6aDPc2`).snapshotChanges().map((arr) => {
      return arr.map((snap) => Object.assign(snap.payload.val(), { $key: snap.key }) );
    });

    // return this.db.list(`items`).snapshotChanges().map((arr) => {
    //   return arr.map((snap) => Object.assign(snap.payload.val(), { $key: snap.key }) );
    // });
  }


  getItemsList(): AngularFireList<Log []> {
    if (!this.userId) return;
    this.Logs = this.db.list(`logs/${this.userId}`);
    return this.Logs
  }

  createLog(log: any)  {
    this.db.list(`logs/${this.userId}`).push(log);
  }

}
