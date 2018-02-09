import { Component, OnInit, ViewChild , AfterViewInit } from '@angular/core';
// import { DataTableResource } from 'angular-4-data-table-bootstrap-4';
import { fadeInAnimation } from './../shared/fadein.animation';
import { style } from '@angular/animations';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { User } from './../core/user';
import { ReportService } from './shared/report.service';


@Component({
  selector: 'reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})

export class ReportsComponent  implements OnInit, AfterViewInit {

  usersData: any;
  withLogs: any;
  color = 'primary';
  mode = 'indeterminate';
  loading : boolean = true;

  displayedColumns = ['displayName', 'email','timerStatus'];
  dataSource: MatTableDataSource<any>; 

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private rs: ReportService) {
      this.usersData = this.rs.getCollection();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.usersData.subscribe(data => {
      this.dataSource = new MatTableDataSource<User>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    })
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  trackByUid(index, item) {
    return item.uid;
  }


}

// export class UserDataSource extends DataSource<any> {
//   constructor(private rS: ReportService) {
//     super();
//   }
//   connect(): Observable<User[]> {
//     return this.rS.getCollection();
//   }
//   disconnect() {}
// }
