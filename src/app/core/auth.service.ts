/// <reference path="../../assets/js/toastr.d.ts" />

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
// import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { NotifyService } from './notify.service';

import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { User } from './user';

@Injectable()
export class AuthService {

  user: Observable<User | null>;
  userId: any;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router,
              public notify: NotifyService) {

    this.user = this.afAuth.authState
      .switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return Observable.of(null);
        }
      });

      // this.afAuth.authState
      //       .do(user => {
      //         if (user) {
      //            this.userId = user.uid
      //           //  this.updateOnConnect()
      //            this.updateOnDisconnect() // <-- new line added
      //         }
      //       })
      //   .subscribe();
  }

  ////// OAuth Methods /////

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider: firebase.auth.AuthProvider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        
        let promiss = this.updateUserData(credential);
        // this.notify.update('Welcome to Employee Management System!!!', 'success');
        return promiss;
      })
      .catch((error) => {
        if(error.message == 'Missing or insufficient permissions.'){
          toastr.error('Only users with Nordicomm Domain are allowed access');
          this.notify.update('Only users with Nordicomm Domain are allowed access', 'error');
          this.signOut();
        }
        else{
          this.handleError(error);
        }
      });
  }


  signOut() {
   
     const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${this.afAuth.auth.currentUser.uid}`);
     const data: any = {
       timerStatus: false
     };

     userRef.update(data).then(()=> {
      this.afAuth.auth.signOut().then(() => {
        
          this.router.navigate(['/login']);
          // toastr.success('Logout Successfull');
      });
     }).catch(()=>{
       console.log('user not registered');
     
     });
    
    
  }

    /// Helper to perform the update in Firebase
  public updateStatus(status: string) {
    if (!this.userId) return
    this.afs.doc(`users/` + this.userId).update({ timerStatus: status })
  }

  // Updates status when connection to Firebase ends
  // private updateOnDisconnect() {
  //   firebase.database().
  //     .onDisconnect()
  //     .update({status: 'offline'});
  //   firebase.database().ref().child(`users/${this.userId}`)
  //           .onDisconnect()
  //           .update({status: 'offline'})
  // }

  // If error, console log and notify user
  private handleError(error: Error) {
    toastr.error(error.message);
    console.log(error);
    // this.notify.update(error.message, 'error');
  }

  // Sets user data to firestore after succesful login
  private updateUserData(credential) {

    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${credential.user.uid}`);

    const data: User = {
      uid: credential.user.uid,
      email: credential.additionalUserInfo.profile.email || null,
      displayName: credential.additionalUserInfo.profile.name || 'nameless user',
      photoURL: credential.additionalUserInfo.profile.picture || 'https://goo.gl/Fz9nrQ',
      roles: {
        subscriber: true
      }
    };
    return userRef.set(data,{ merge: true });
    // .catch((error) => {
    //   console.log("Error updating user document doesn't exists"); // (document does not exists)
    //   return userRef.set(data);
    // });
  }

  ///// Role-based Authorization //////
  isSubscriber(user: User): boolean {
    const allowed = ['admin', 'hr', 'subscriber']
    return this.checkAuthorization(user, allowed)
  }
  isHR(user: User): boolean {
    const allowed = ['admin', 'hr']
    return this.checkAuthorization(user, allowed)
  }
  isAdmin(user: User): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(user, allowed)
  }
  // determines if user has matching role
  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) return false
    for (const role of allowedRoles) {
      if ( user.roles[role] ) {
        return true
      }
    }
    return false
  }


}
