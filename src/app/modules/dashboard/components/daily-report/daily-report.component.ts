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
  pageSize = 10;
  pageIndex = 1;
  showFirstLastButtons = true;
  userRequirement: any = [];
  totalCount: any;
  data: any;
  displayDate: any;
  startDate: string | null = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  endDate: string | null = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  reportUserId: any = '';
  showRecruiters: boolean = false;
  recruiterName: string = 'Select';
  recruiterKeys: any[] = [];
  currentPage: number = 1;
  lastPage: any;
  userCount: any;
  today: any;
  initialLoader: boolean = false;
  loader: boolean = false;
  constructor(private apiService: ApiService, private datePipe: DatePipe) { }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.showRecruiters = false;
    }
  }

  ngOnInit(): void {
    this.initialLoader = true;
    this.reportUserId = localStorage.getItem('userId');
    this.fetchDetails();
    this.today = new Date();
  }

  fetchDetails(): void {
    if (!this.initialLoader) this.loader = true
    const totalPages = Math.ceil(this.userCount / this.pageSize);
    this.lastPage = totalPages;
    if (this.currentPage > totalPages) this.currentPage = totalPages;
    this.apiService.get(`/report/report-list?reportUserId=${this.reportUserId}&reportFromDate=${this.startDate}&reportToDate=${this.endDate}&reportPageNo=${this.currentPage}&reportPageLimit=${this.pageSize}`)
      .subscribe((res: any) => {
        if (res?.data) {
          this.initialLoader = false;
          this.loader = false;
          this.userRequirement = [];
          this.userRequirement = res?.data;
          this.totalCount = res?.reportCount;
          const totalPages = Math.ceil(this.totalCount / this.pageSize);
          this.lastPage = totalPages;
          if (this.currentPage > totalPages) this.currentPage = totalPages;
          this.userRequirement.forEach((objectItem: any) => {
            this.recruiterKeys = Object.keys(objectItem);
          })
        }
      });
  }

  generatePageNumbers() {
    let pages = [];
    if (this.lastPage <= 5) {
      for (let i = 1; i <= this.lastPage; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, this.currentPage - 1);
      let end = Math.min(this.lastPage - 1, this.currentPage + 1);

      if (this.currentPage <= 3) end = 4;
      else if (this.currentPage >= this.lastPage - 2) start = this.lastPage - 3;
      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < this.lastPage - 1) pages.push('...');
      pages.push(this.lastPage);
    }
    return pages;
  }


  selectRecruiter(recruiter: string, recruiterId: string): void {
    this.recruiterName = recruiter;
    this.reportUserId = recruiterId;
    this.showRecruiters = false;
    this.currentPage = 1;
    this.pageSize = 10;
    this.fetchDetails();
  }

  dateChange(event: any, range: string): void {
    let date = new Date(event?.value);
    if (range == 'startDate') this.startDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    if (range == 'endDate') this.endDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.currentPage = 1;
    this.pageSize = 10;
    this.fetchDetails();
  }


  dateSearch(start: any, end: any, name: any): void {
    this.startDate = start;
    this.endDate = end;
    this.recruiterName = name;
    this.fetchDetails()
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.fetchDetails();
  }
}
