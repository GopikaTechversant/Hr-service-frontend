import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.css'],
  providers: [DatePipe],

})
export class DailyReportComponent implements OnInit {
  length: any = 20;
  pageSize = 10;
  pageIndex = 1;
  pageSizeOptions = [10, 25, 30];
  showFirstLastButtons = true;
  userRequirement: any;
  currentPag: number = 1;
  currentLimit: number = 7;
  totalCount: any;
  data: any;
  displayDate: any;
  startDate?: Date;
  endDate?: Date;
  reportUserId: any = '13';
  reportFromDate: any = '';
  reportToDate: any = '';
  reportPageNo: any = '';
  reportPageLimit: any = '';
  constructor(private http: HttpClient, private router: Router, private datePipe: DatePipe) {
    this.startDate = new Date(); 
    this.endDate = new Date(); 
   }
  ngOnInit(): void {
    this.fetchDetails();
  }

  fetchDetails(): void {
    this.http.get(`${environment.api_url}/report/report-list?reportUserId=${this.reportUserId}&reportFromDate=${this.reportFromDate}&reportToDate=${this.reportToDate}&reportPageNo=${this.reportPageNo}&reportPageLimit=${this.reportPageLimit}`)
      .subscribe((res: any) => {
        this.userRequirement = [];
        this.userRequirement = res?.data;
      });
  }
  
  dateChange(event: any, range: string): void {
    let date = new Date(event?.value);
    if (range == 'startDate') this.startDate = date;
    if (range == 'endDate') this.endDate = date;
  }
  
  pageChange(event: any): void {
    let skip = parseInt(event, 10);
    this.currentPag = skip;
  }

  handlePageEvent(event: any) {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchDetails();
  }

}
