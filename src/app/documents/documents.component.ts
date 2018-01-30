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

}
