import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';

import { AsyncLocalStorage } from 'angular-async-local-storage';

import { AngularFireAuth } from 'angularfire2/auth';

import { Log } from "./../../activity-logs/shared/activity";
import { Observable } from 'rxjs/Observable';

import { Http, Headers, Response ,RequestOptions} from '@angular/http';

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

      
        // this.userId = this.afAuth.auth.currentUser.uid; 


      let _this = this;
      this.currentStatus.subscribe(x=> {
          if(x == true){
            window.onbeforeunload = function (e) {
                _this.updateTimerStatus(false);                
                // var e = e || window.event;
                console.log('exiting');
                //IE & Firefox
                if (e) {
                  e.returnValue = 'Are you sure?';
                }
              
                // For Safari
                return 'Are you sure?';
              };
          }
      })
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
    // console.log(moment(firebase.firestore.FieldValue.serverTimestamp()));
    return firebase.database.ServerValue.TIMESTAMP
  }

  createLog(log: any)  {
    if(this.afAuth)
      this.userId = this.afAuth.auth.currentUser.uid; 
    this.saveLog(this.userId , log);
  }

  saveLog(userId, log:any) {
    let now = moment();
    let start = moment().subtract(log.duration, 'm');
    const userRef: AngularFirestoreCollection<any> = this.afs.collection(`users/`).doc(''+userId+'/').collection('logs');
    userRef.add({
      ...log,
      startAt: start.format(),
      createdAt: now.format(),
      date: now.format('YYYY/MM/DD'),
      timeStamp: new Date().getTime()
    })
    .then( x => console.log('Activity Log Saved') )
    .catch( error => this.handleError(error));
  }

  postToSlack(message: string) {
    let slackUrl = 'https://slack.com/api/chat.postMessage';
    let channelID = 'GAFB23K70';
    let api_token = 'xoxp-17073777729-253284235666-354391834403-94be0949b7c962a011596841768d6ff5';

    let cpHeaders = new Headers(
      { "Accept" : "application/json"}
    );
    let options = new RequestOptions({ headers : cpHeaders });
    this.http.post(`${slackUrl}?token=${api_token}&channel=${channelID}&text=${message}&username=Nordicomm EMS&as_user=false`,options).subscribe(data => console.log(data), error => console.error(error));
    
  }

  getTodayPomodoroCount(): Observable<any> {
    if(this.afAuth)
      this.userId = this.afAuth.auth.currentUser.uid; 
    let today = moment().format('YYYY/MM/DD');
    if (!this.userId) return Observable.of();
    let LogsCollection = this.afs.collection<Log>('users/'+this.userId+'/logs', 
      ref => ref.where('date', '==', today).where('fullCycle','==', true).where('duration','==',25)
      .orderBy('createdAt',"desc"));
    return LogsCollection.snapshotChanges().map(logs => {
      return logs.length; 
    });

  }

   // If error, console log and notify user
   private handleError(error: Error) {
    toastr.error(error.message);
    console.log(error);
    // this.notify.update(error.message, 'error');
  }

}
