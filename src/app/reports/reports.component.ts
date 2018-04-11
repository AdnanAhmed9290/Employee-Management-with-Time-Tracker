import {Component, OnInit, ViewChild, AfterViewInit }from '@angular/core'; 
// import { DataTableResource } from 'angular-4-data-table-bootstrap-4';
import {fadeInAnimation }from './../shared/fadein.animation'; 
import {style }from '@angular/animations'; 
import {MatTableDataSource, MatSort, MatPaginator }from '@angular/material'; 
import {User }from './../core/user'; 
import {ReportService }from './shared/report.service'; 

declare var jsPDF:any; // Important 

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

  displayedColumns = ['displayName', 'email', 'timerStatus']; 
  dataSource:MatTableDataSource < any > ; 

  @ViewChild(MatSort)sort:MatSort; 
  @ViewChild(MatPaginator)paginator:MatPaginator; 

  constructor(private rs:ReportService) {
      this.usersData = this.rs.getCollection(); 
  }

  ngOnInit() {
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

  trackByUid(index, item) {
    return item.uid; 
  }


  generateReports() {
    this.reportData = []; 
    // let resp = async this.rs.getAllEmployees();
    this.rs.getAllEmployees().subscribe(async data =>  {
      // console.log(data);
      await data.map(user =>  {
        let log =  {
          name:user.displayName, 
          pomodoro:[]
        }
        this.rs.getReportOfAllEmployees(user.id).subscribe(data =>  {
          log.pomodoro = data; 
        })

        this.reportData.push(log); 
        
        // setTimeout(console.log('asa') ,2000);
        // this.spans(this.reportData);
      })

    }, error =>  {
      console.log(error); 
    });

    this.generatePdf(this.reportData);
  }

  generatePdf (reports) {
      
      
      var columns = [
        // {title: "ID", dataKey: "id"},
        {title: "Title", dataKey: "task"}, 
        {title: "Project", dataKey: "project"}, 
        {title: "Time",dataKey: "timeline"}
      ];

      var doc = new jsPDF('l'); 
      doc.setFontSize(12); 
     
      setTimeout(() => {

        doc.setTextColor(0); 
        doc.setFontStyle('bold'); 
        doc.text(reports[0].name, 16, 10); 
        
        doc.setFontStyle('normal');
        doc.setTextColor(255,0,0); 
        doc.text("Pomodoro Cycles: "+reports[0].pomodoro.length, 100, 10); 
        
        doc.setFontStyle('bold');
        doc.setTextColor(0); 
        doc.autoTable(columns, reports[0].pomodoro,  {
          startY:20
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
      }, 1000);

  }; 

}

