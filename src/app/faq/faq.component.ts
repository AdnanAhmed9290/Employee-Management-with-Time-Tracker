import { Component, OnInit } from '@angular/core';
import { fadeInAnimation } from "./../shared/fadein.animation";

@Component({
  selector: 'faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class FaqComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
