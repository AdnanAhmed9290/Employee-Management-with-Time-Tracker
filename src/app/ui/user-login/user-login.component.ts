import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent {

  constructor(public auth: AuthService,
              private router: Router) {}

  /// Social Login

  signInWithGoogle() {
    this.auth.googleLogin()
      .then(() => {
        // this.auth.notify.update('Welcome to Employee Management System!!!', 'success');
        this.router.navigate(['/timer']);
        // this.showSpinner = true;
        // this.afterSignIn()
      },error=>console.log(error.messages));
  }

  /// Shared

  private afterSignIn() {
    // Do after login stuff here, such router redirects, toast messages, etc.
    
  }

}
