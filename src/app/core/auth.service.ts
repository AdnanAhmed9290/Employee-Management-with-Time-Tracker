/// <reference path="../../assets/js/toastr.d.ts" />

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { NotifyService } from './notify.service';

import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { User } from './user';

@Injectable()
export class AuthService {

  user: Observable<User | null>;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router,
              private notify: NotifyService) {

    this.user = this.afAuth.authState
      .switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return Observable.of(null);
        }
      });
  }

  ////// OAuth Methods /////

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  // githubLogin() {
  //   const provider = new firebase.auth.GithubAuthProvider();
  //   return this.oAuthLogin(provider);
  // }

  // facebookLogin() {
  //   const provider = new firebase.auth.FacebookAuthProvider();
  //   return this.oAuthLogin(provider);
  // }

  // twitterLogin() {
  //   const provider = new firebase.auth.TwitterAuthProvider();
  //   return this.oAuthLogin(provider);
  // }

  private oAuthLogin(provider: firebase.auth.AuthProvider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        // this.notify.update('Welcome to Employee Management System!!!', 'success');
        return this.updateUserData(credential);
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

  //// ============= Anonymous Auth ====================== ////

  // anonymousLogin() {
  //   return this.afAuth.auth.signInAnonymously()
  //     .then((user) => {
  //       this.notify.update('Welcome to Employee Management System !!!', 'success');
  //       return this.updateUserData(user); // if using firestore
  //     })
  //     .catch((error) => {
  //       console.error(error.code);
  //       console.error(error.message);
  //       this.handleError(error);
  //     });
  // }

  //// ======================= Email/Password Auth =================== ////

  // emailSignUp(email: string, password: string) {
  //   return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
  //     .then((user) => {
  //       this.notify.update('Welcome to Firestarter!!!', 'success');
  //       return this.updateUserData(user); // if using firestore
  //     })
  //     .catch((error) => this.handleError(error) );
  // }

  // emailLogin(email: string, password: string) {
  //   return this.afAuth.auth.signInWithEmailAndPassword(email, password)
  //     .then((user) => {
  //       this.notify.update('Welcome to Firestarter!!!', 'success')
  //       return this.updateUserData(user); // if using firestore
  //     })
  //     .catch((error) => this.handleError(error) );
  // }

  // =========== Sends email allowing user to reset password ==================
  // resetPassword(email: string) {
  //   const fbAuth = firebase.auth();

  //   return fbAuth.sendPasswordResetEmail(email)
  //     .then(() => this.notify.update('Password update email sent', 'info'))
  //     .catch((error) => this.handleError(error));
  // }

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
      this.afAuth.auth.signOut().then(() => {
        
          this.router.navigate(['/login']);
          // toastr.success('Logout Successfull');
      });
     });
    
    
  }

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
