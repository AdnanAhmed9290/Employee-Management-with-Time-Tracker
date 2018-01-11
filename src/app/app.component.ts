import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from './core/auth.service';
import { TopNavComponent } from './ui/top-nav/top-nav.component'
import {
  Router,
  // import as RouterEvent to avoid confusion with the DOM Event
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {

    @ViewChild(TopNavComponent) topNav:boolean;
    
    collapseNav: boolean = false;
    // Sets initial value to true to show loading spinner on first load
    loading = true
    
      constructor(private router: Router) {
        router.events.subscribe((event: RouterEvent) => {
          this.navigationInterceptor(event)
        })
      }

      ngAfterViewInit(){
        // this.collapseNav = this.topNav.collapseNav;
      }

      ngAfterContentChecked(){
        // console.log('ass');
        // this.collapseNav = this.topNav.collapseNav;
      }
    
      // Shows and hides the loading spinner during RouterEvent changes
      navigationInterceptor(event: RouterEvent): void {
        if (event instanceof NavigationStart) {
          this.loading = true
        }
        if (event instanceof NavigationEnd) {
          this.loading = false
        }
    
        // Set loading state to false in both of the below events to hide the spinner in case a request fails
        if (event instanceof NavigationCancel) {
          this.loading = false
        }
        if (event instanceof NavigationError) {
          this.loading = false
        }
      }
}
