import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.css'],
  providers: [DatePipe],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
})
export class DailyReportComponent implements OnInit {
  @Input() requitersList: any;
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
  reportUserId: any = '';
  reportFromDate: any = '';
  reportToDate: any = '';
  reportPageNo: any = '';
  reportPageLimit: any = '';
  showRecruiters: boolean = false;
  recruiterName: string = 'Select';
  recruiterKeys: any[] = [];
  fromDate:any;
  constructor(private http: HttpClient, private router: Router, private datePipe: DatePipe) {
    this.startDate = new Date();
    this.endDate = new Date();
  }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.showRecruiters = false;
    }
  }

  ngOnInit(): void {
    this.reportUserId = localStorage.getItem('userId');
    this.fetchDetails();
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['requitersList'] && this.requitersList) {
  //     console.log(this.requitersList, "List is now available");
  //   }
  // }

  fetchDetails(): void {
    this.http.get(`${environment.api_url}/report/report-list?reportUserId=${this.reportUserId}&reportFromDate=${this.reportFromDate}&reportToDate=${this.reportToDate}&reportPageNo=${this.reportPageNo}&reportPageLimit=${this.reportPageLimit}`)
      .subscribe((res: any) => {
        this.userRequirement = [];
        this.userRequirement = res?.data;
        console.log(" this.userRequirement", this.userRequirement);
        this.userRequirement.forEach((objectItem: any) => {
          this.recruiterKeys = Object.keys(objectItem);
          console.log("Keys of an object:", this.recruiterKeys);
        })
      });
  }

  selectRecruiter(recruiter: string, recruiterId: string): void {
    this.recruiterName = recruiter;
    this.reportUserId = recruiterId;
    this.showRecruiters = false;
    this.fetchDetails();
  }

  dateChange(event: any, range: string): void {
    let date = new Date(event?.value);
    if (range == 'startDate') this.startDate = date;
    if (range == 'endDate') this.endDate = date;
    this.fromDate = this.startDate;
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
  dateSearch(): void {
    this.reportFromDate = this.startDate;
    this.reportToDate = this.endDate;
    this.fetchDetails()
  }
}
