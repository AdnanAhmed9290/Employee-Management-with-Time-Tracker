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

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private afs: AngularFirestore) {
      if(this.afAuth)
        this.userId = this.afAuth.auth.currentUser.uid; 
  }

   // Return an observable list with optional query
  // You will usually call this from OnInit in a componenta
  
  getLogsList(date: string): Observable<Log []> {

    if (!this.userId) return Observable.of();
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

}
