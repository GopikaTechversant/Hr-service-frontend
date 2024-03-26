import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

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
  // length: any = 20;
  pageSize = 4;
  pageIndex = 1;

  showFirstLastButtons = true;
  userRequirement: any = [];
  // currentPag: number = 1;
  // currentLimit: number = 7;
  totalCount: any;
  data: any;
  displayDate: any;
  startDate?: Date;
  endDate?: Date;
  reportUserId: any = '';
  reportFromDate: any = '';
  reportToDate: any = '';
  // reportPageNo: any = '';
  // reportPageLimit: any = '';
  showRecruiters: boolean = false;
  recruiterName: string = 'Select';
  recruiterKeys: any[] = [];
  fromDate: any;
  currentPage: number = 1;
  lastPage: any;
  userCount: any;
  today: any;
  constructor(private apiService: ApiService) {
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
    this.today = new Date();
  }

  fetchDetails(): void {
    const totalPages = Math.ceil(this.userCount / this.pageSize);
    this.lastPage = totalPages;
    if (this.currentPage > totalPages) this.currentPage = totalPages;
    this.apiService.get(`/report/report-list?reportUserId=${this.reportUserId}&reportFromDate=${this.reportFromDate}&reportToDate=${this.reportToDate}&reportPageNo=${this.currentPage}&reportPageLimit=${this.pageSize}`)
      .subscribe((res: any) => {
        if (res?.data) {
          // this.userRequirement = [];
          this.userRequirement = res?.data;
          this.totalCount = res.reportCount;
          console.log("this.userRequirement", this.userRequirement);
          this.userRequirement.forEach((objectItem: any) => {
            this.recruiterKeys = Object.keys(objectItem);
          })
        }
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

  // pageChange(event: any): void {
  //   let skip = parseInt(event, 10);
  //   this.currentPag = skip;
  // }

  // handlePageEvent(event: any) {
  //   this.length = event.length;
  //   this.pageSize = event.pageSize;
  //   this.pageIndex = event.pageIndex;
  //   this.fetchDetails();
  // }

  dateSearch(): void {
    this.reportFromDate = this.startDate;
    this.reportToDate = this.endDate;
    this.fetchDetails()
  }
  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.fetchDetails();
  }
}
