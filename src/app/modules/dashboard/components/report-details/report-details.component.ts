import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ApiService } from 'src/app/services/api.service';
import { ToastrServices } from 'src/app/services/toastr.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.css'],
  host: {
    '(document:click)': 'onBodyClick($event)'
  },
  providers: [DatePipe],

})
export class ReportDetailsComponent implements OnInit {
  chart: any;
  reportUserId: any = '';
  currentYear: any = '';
  reportMonth: any = '';
  userRequirement: any = [];
  requirementDetail: any;
  totalReport: any;
  requirementDetailData: any;
  selectedMonth: string = '';
  showMonth: boolean = false;
  currentMonth: any;
  monthValue: any;
  monthData: any[] = [{ month: 'January', number: '01' }, { month: 'February', number: '02' }, { month: 'March', number: '03' },
  { month: 'April', number: '04' }, { month: 'May', number: '05' }, { month: 'June', number: '06' }, { month: 'July', number: '07' },
  { month: 'August', number: '08' }, { month: 'September', number: '09' }, { month: 'October', number: '10' },
  { month: 'November', number: '11' }, { month: 'December', number: '12' }];
  recruiters: any;
  showRecruiters: boolean = false;
  recruiterName: string = '';
  error: boolean = false;
  interviewDetails: any;
  currentPage: number = 1;
  pageSize = 10;
  pageSizeOptions = [10, 25, 30];
  showFirstLastButtons = true;
  today: any;
  lastPage: any;
  totalCount: any;
  loader: boolean = false;
  initialLoader: boolean = false;
  endDate: string | null = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  formattedEndDate: string = ''; // New variable for formatted display

  constructor(private tostr: ToastrServices, private apiService: ApiService, private datePipe: DatePipe) { }
  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.showRecruiters = false;
      this.showMonth = false;
    }
  }

  ngOnInit(): void {
    this.initialLoader = true;
    this.today = new Date()
    // this.reportUserId = localStorage.getItem('userId');
    this.currentYear = new Date().getFullYear();
    this.reportMonth = new Date().getMonth() + 1;
    const options = { month: 'long', year: 'numeric' } as Intl.DateTimeFormatOptions;
    this.formattedEndDate = new Date().toLocaleDateString('en-US', options);
    this.fetchDetails();
    this.fetchRecruiters();
    this.fetchInterviewStatus(this.currentPage);
    this.getCurrentMonth();
  }

  ngAfterViewInit(): void {
    Chart.register(ChartDataLabels);
  }

  fetchRecruiters(): void {
    this.apiService.get(`/dashboard/recruiter-list`)
      .subscribe((res: any) => {
        this.recruiters = res?.data;
      });
  }

  fetchInterviewStatus(page: any): void {
    if (page) this.currentPage = page;
    this.interviewDetails = [];
    this.apiService.get(`/report/over-all-interview-status?page=${this.currentPage}&limit=${this.pageSize}`).subscribe((res: any) => {
      if (res?.data) {
        this.initialLoader = false;
        this.interviewDetails = res?.data;
        this.totalCount = res?.toatlCount;
        const totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.lastPage = totalPages;
        if (this.currentPage > totalPages) this.currentPage = totalPages;
      }
    })
  }

  fetchDetails(): void {
    this.apiService.get(`/report/month-report-data?month=${this.endDate}&userId=${this.reportUserId}`).subscribe((res: any) => {
      if (res?.data) {
        this.userRequirement = [];
        this.totalReport = [];
        this.userRequirement = res?.data?.[0];
        this.totalReport = res?.totalReportMonth?.[0];
      }
    }, (error) => {
      if (error?.status === 500) {
        this.tostr.error("Internal Server Error");
      } else {
        this.tostr.warning("No data found due to invalid request");
        this.userRequirement = [];
        this.totalReport = [];
        this.error = true;
      }
      if (this.chart) {
        this.chart.destroy();
      }
    });
  }

  // selectMonth(monthNumber: string, month: string): void {
  //   this.reportMonth = monthNumber;
  //   this.selectedMonth = month;
  //   this.showMonth = false;
  //   this.fetchDetails();
  // }

  selectRecruiter(recruiter: string, recruiterId: string): void {
    this.recruiterName = recruiter;
    this.reportUserId = recruiterId;
    this.showRecruiters = false;
    this.fetchDetails();
  }

  clearFilter(item: string): void {
    if (item === 'month') {
      this.reportMonth = new Date().getMonth() + 1;
      this.selectedMonth = "";
    }
    if (item === 'recruiter') {
      this.recruiterName = "";
      this.reportUserId = '';
    }
    this.fetchDetails();
  }


  getCurrentMonth(): void {
    this.currentMonth = this.monthData.find(item => item.number == this.reportMonth);
    if (this.currentMonth) this.monthValue = this.currentMonth.month;
  }

  createChart() {
    if (this.chart) this.chart.destroy();
    this.chart = new Chart("Chart", {
      type: 'doughnut',
      data: {
        labels: ['Resumes Sourced & Screened by Recruiter', 'Candidates Contacted by Recruiter', 'Interested candidates', 'Interviews scheduled', 'Offers released'],
        datasets: [{
          data: this.requirementDetailData,
          backgroundColor: ['#FA4679', '#F57C02', '#628afc', '#047892', '#005ec9'],
          fill: false
        }],
      },
      options: {
        responsive: true,
        aspectRatio: 2.2,
        layout: {
          padding: {
            top: 20,
            right: 10,
            bottom: 10,
            left: 10
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          },
          tooltip: {
            enabled: false
          },
          datalabels: {
            color: '#FFFFFF',
            padding: 0,
            anchor: 'center',
            align: 'center',
            offset: -10,
            font: {
              size: 15,
              weight: 'bold',
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }

  dateChange(event: any, range: string): void {
    let date = new Date(event?.value);
    // if (range == 'startDate') this.startDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    if (range == 'endDate') this.endDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    const options = { month: 'long', year: 'numeric' } as Intl.DateTimeFormatOptions;

    this.formattedEndDate = date.toLocaleDateString('en-US', options); // Format for display

    this.fetchDetails();
    // this.positionId = '';

    // this.fetchApplicationList(this.currentPage);
  }
}
