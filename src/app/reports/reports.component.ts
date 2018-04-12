import {Component, OnInit, ViewChild, AfterViewInit }from '@angular/core'; 
// import { DataTableResource } from 'angular-4-data-table-bootstrap-4';
import {fadeInAnimation }from './../shared/fadein.animation'; 
import {style }from '@angular/animations'; 
import {MatTableDataSource, MatSort, MatPaginator }from '@angular/material'; 
import {User }from './../core/user'; 
import {ReportService }from './shared/report.service'; 

import {NgbDateStruct,NgbDateAdapter, NgbCalendar, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';


declare var jsPDF:any; // Important 
const now = moment();

@Component( {
  selector:'reports', 
  templateUrl:'./reports.component.html', 
  styleUrls:['./reports.component.scss'], 
  animations:[fadeInAnimation], 
  host: {'[@fadeInAnimation]':''}
})

export class ReportsComponent  implements OnInit, AfterViewInit {

  usersData:any; 
  withLogs:any; 
  color = 'primary'; 
  mode = 'indeterminate'; 
  loading:boolean = true; 
  reportData = []; 
  dateSelected: NgbDateStruct;
  maxDate: any;

  displayedColumns = ['displayName', 'email', 'timerStatus']; 
  dataSource:MatTableDataSource < any > ; 

  @ViewChild(MatSort)sort:MatSort; 
  @ViewChild(MatPaginator)paginator:MatPaginator; 

  constructor(private rs:ReportService) {
      this.usersData = this.rs.getCollection(); 
  }

  ngOnInit() {
    this.selectToday();
    this.maxDate = this.dateSelected;
  }

  getDate(d: any): any{
    let date = d.year+"/"+d.month+"/"+d.day;
    return date;
  }

  selectToday() {
    this.dateSelected = {year: now.year(), month: now.month() + 1, day: now.date() };
  }

  ngAfterViewInit() {
    this.usersData.subscribe(data =>  {
      this.dataSource = new MatTableDataSource < User > (data); 
      this.dataSource.paginator = this.paginator; 
      this.dataSource.sort = this.sort; 
      this.loading = false; 
    })
  }

  applyFilter(filterValue:string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue; 
  }

  onDateChange(){
    console.log(this.dateSelected);
  }

  trackByUid(index, item) {
    return item.uid; 
  }


  generateReports() {

    this.reportData = []; 
    let datePicked = moment(this.getDate(this.dateSelected)).format('YYYY/MM/DD');
    this.rs.getAllEmployees().subscribe(async data =>  {
      // console.log(data);
      await data.map(user =>  {
        let log =  {
          name:user.displayName, 
          pomodoro:[]
        }
        this.rs.getReportOfAllEmployees(user.id,datePicked ).subscribe(data =>  {
          log.pomodoro = data; 
        })

        this.reportData.push(log); 
      
      })

    }, error =>  {
      console.log(error); 
    });

    this.generatePdf(this.reportData);
  }

  generatePdf (reports) {
    
      var columns = [
        {title: "Title", dataKey: "task"}, 
        {title: "Project", dataKey: "project"}, 
        {title: "Time",dataKey: "timeline"}
      ];
      let datePicked = moment(this.getDate(this.dateSelected)).format('dddd, Do MMMM, YYYY');
      var doc = new jsPDF('l'); 

      doc.setFontSize(20); 
      doc.setTextColor(0); 
      doc.setFontStyle('bold'); 
      doc.text("Report Date : "+datePicked, 80, 15); 
      doc.setFontSize(12); 
     
      setTimeout(() => {

        doc.setTextColor(0); 
        doc.setFontStyle('bold'); 
        doc.text(reports[0].name, 16, 40); 
        
        doc.setFontStyle('normal');
        doc.setTextColor(255,0,0); 
        doc.text("Pomodoro Cycles: "+reports[0].pomodoro.length, 100, 40); 
        
        doc.setFontStyle('bold');
        doc.setTextColor(0); 
        doc.autoTable(columns, reports[0].pomodoro,  {
          startY:50
        }); 
        
        for( let i = 1; i < reports.length; i++){
          
          doc.text(reports[i].name, 16, doc.autoTable.previous.finalY + 15); 

          doc.setFontStyle('normal');
          doc.setTextColor(255,0,0);  
          doc.text("Pomodoro Cycles: "+reports[i].pomodoro.length, 100, doc.autoTable.previous.finalY + 15); 

          doc.setFontStyle('bold');
          doc.setTextColor(0);
          doc.autoTable(columns, reports[i].pomodoro,  {
            startY: doc.autoTable.previous.finalY + 25
          });
        }

        doc.save('reports.pdf'); 
      }, 3000);

  }; 

}

