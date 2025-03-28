import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ExportService } from 'src/app/services/export.service';

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
  startDate: string | null = this.datePipe.transform(new Date(Date.now() - 31 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  endDate: string | null = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  reportUserId: any = '';
  showRecruiters: boolean = false;
  recruiterName: string = '';
  recruiterKeys: any[] = [];
  currentPage: number = 1;
  lastPage: any;
  userCount: any;
  today: any;
  initialLoader: boolean = false;
  loader: boolean = false;
  report: boolean = false;
  url: any;
  userType: any;
  constructor(private apiService: ApiService, private datePipe: DatePipe, private exportService: ExportService) { }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.showRecruiters = false;
    }
  }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType')
    // Retrieve the last page from localStorage (if available)
    const savedPage = localStorage.getItem('currentPageDailyReport');
    this.currentPage = savedPage ? parseInt(savedPage, 10) : 1;
    this.initialLoader = true;
    this.fetchDetails(this.currentPage);
    this.today = new Date();
  }

  isNumberOrDate(value: any): boolean {
    return !isNaN(value);
  }

  fetchDetails(page: any): void {
    if (page) this.currentPage = page;
    if (!this.initialLoader) this.loader = true
    const url = `/report/report-list`
    let params = [
      `reportUserId=${this.reportUserId}`,
      `reportFromDate=${this.startDate}`,
      `reportToDate=${this.endDate}`,
      `reportPageNo=${this.report ? '' : this.currentPage}`,
      `reportPageLimit=${this.report ? '' : this.pageSize}`,
      `report=${this.report}`
    ].filter(param => param.split('=')[1] !== '').join('&');
    if (this.report) {
      const exportUrl = `${url}?${params}`;
      this.apiService.getTemplate(exportUrl).subscribe(
        (data: Blob) => {
          if (data.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (event) => {
              const text = event.target?.result as string;
              const jsonResponse = JSON.parse(text);
              this.downloadAsExcel(jsonResponse.data, 'daily_report.xlsx');
              this.loader = false;
            };
            reader.readAsText(data);
            this.loader = false;
          } else {
            this.loader = false;
            this.downloadBlob(data, 'daily_report.xlsx');
          }
        },
        (error: any) => {
          this.loader = false;
          this.initialLoader = false;
        }
      ); this.report = false;
      if (this.report === false) this.fetchDetails(this.currentPage);
      return;
    }
    this.userRequirement = [];
    this.apiService.get(`${url}?${params}`).subscribe((res: any) => {
      if (res?.data) {
        this.initialLoader = false;
        this.loader = false;
        this.userRequirement = res?.data;
        this.totalCount = res?.reportCount;
        const totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.lastPage = totalPages;
        if (this.currentPage > totalPages) this.currentPage = totalPages;
        this.userRequirement.forEach((objectItem: any) => {
          this.recruiterKeys = Object.keys(objectItem);
        })
      }
    }, (error: any) => {
      this.loader = false;
      this.initialLoader = false;
    });
    localStorage.setItem('currentPageDailyReport', this.currentPage.toString());
  }

  downloadAsExcel(jsonData: any[], fileName: string) {
    this.exportService.downloadAsExcel(jsonData, fileName);
  }

  downloadBlob(blob: Blob, fileName: string) {
    this.exportService.downloadBlob(blob, fileName);
  }

  downloadAsJson(jsonResponse: any) {
    this.exportService.downloadAsJson(jsonResponse);
  }

  selectRecruiter(recruiter: string, recruiterId: string): void {
    this.recruiterName = recruiter;
    this.reportUserId = recruiterId;
    this.showRecruiters = false;
    this.currentPage = 1;
    this.pageSize = 10;
    this.fetchDetails(this.currentPage);
  }

  dateChange(event: any, range: string): void {
    let date = new Date(event?.value);
    if (range == 'startDate') this.startDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    if (range == 'endDate') this.endDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.currentPage = 1;
    this.pageSize = 10;
    this.fetchDetails(this.currentPage);
  }

  dateSearch(start: any, end: any, name: any): void {
    this.startDate = start;
    this.endDate = end;
    this.recruiterName = name;
    this.currentPage = 1;
    this.pageSize = 10;
    this.fetchDetails(this.currentPage)
  }

  exportData(): void {
    this.loader = true;
    this.report = true;
    this.fetchDetails(this.currentPage);
  }


  clearFilter(item: string): void {
    if (item === 'recruiter') {
      this.recruiterName = "";
      this.reportUserId = "";
    }
    this.currentPage = 1;
    this.pageSize = 10;
    this.fetchDetails(this.currentPage);
  }
}
