import { Component, OnInit } from '@angular/core';
import { fadeInAnimation } from "./../shared/fadein.animation";

@Component({
  // moduleId: module.id.toString(),
  selector: 'documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class DocumentsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  slideConfig = {
    "arrows": true,
    "dots": true,
    "infinite": true,
    "centerMode": false,
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "autoplay": true,
    "responsive": [{
      "breakpoint": 769,
      "settings":{
          "slidesToShow": 1,
          "arrows": false
          }
      }]
  };

  

}
