import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { TimerService } from '../../timer/shared/timer.service'

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
})
export class TopNavComponent {

  show = false;
  collapseNav: boolean = false;
  timerStatus: boolean;

  toggleCollapse() {
    this.show = !this.show;
  }

  constructor(public auth: AuthService, private timerService: TimerService, private route: Router) { }
  
    logout() {
    this.auth.signOut();
  
  }

  ngOnInit(){
    this.timerService.currentStatus.subscribe(status => {
      this.timerStatus = status;
    })
  }

  nav(link, check: boolean){
    console.log(link);
    
    if(this.timerStatus == false || check == true){
      this.route.navigate([link], { replaceUrl: true }); 
    }
    else{
      let result = confirm("Your timer will be reset if you leave this page !!! Are you sure??");
      if(result == true)
        this.route.navigate([link], { replaceUrl: true });
      else
        this.route.navigate(['/timer']);
    }
  }

}
