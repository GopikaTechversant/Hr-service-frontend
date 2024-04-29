import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-interview-count',
  templateUrl: './interview-count.component.html',
  styleUrls: ['./interview-count.component.css'],
  providers: [DatePipe],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
})
export class InterviewCountComponent implements OnInit {
  chart: any;
  displayDate: string | null = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  pageSize = 10;
  countArray: any[] = [];
  sixMonthCount: any;
  labels: any;
  dataSet: any;
  teamDetails: any;
  showDepartment: boolean = false;
  teamId: any = '';
  teamName: string = '';
  currentPage: number = 1;
  lastPage: any;
  userCount: any;
  totalCount: any;
  constructor(private datePipe: DatePipe, private apiService: ApiService) { }
  ngOnInit(): void {
    Chart.register(ChartDataLabels);
    this.fetchInterviewCounts();
    this.fetchBarchartDetails();
    this.fetchDepartment();
  }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.showDepartment = false;
    }
  }

  fetchInterviewCounts(): void {
    this.apiService.get(`/dashboard/interview-count?date=${this.displayDate}&page=${this.currentPage}&limit=${this.pageSize}`).subscribe((count: any) => {
      this.countArray = count?.data;
      this.totalCount = count?.totalCount;
      const totalPages = Math.ceil(this.totalCount / this.pageSize);
      this.lastPage = totalPages;
      if (this.currentPage > totalPages) this.currentPage = totalPages;
    })
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


  fetchBarchartDetails(): void {
    this.apiService.get(`/dashboard/six-month-count?team=${this.teamId}`).subscribe((res: any) => {
      if (res?.data) {
        this.sixMonthCount = res?.data;
        this.labels = Object.keys(this.sixMonthCount[0]);
        this.dataSet = Object.values(this.sixMonthCount[0]);
        this.createBarChart();
      }
    })
  }

  fetchDepartment(): void {
    this.apiService.get(`/service-request/team`).subscribe((res: any) => {
      if (res?.data) {
        this.teamDetails = res?.data
      }
    })
  }

  selectDepartment(team: string, teamId: string): void {
    this.teamName = team;
    this.teamId = teamId;
    this.showDepartment = false;
    this.fetchBarchartDetails();
  }

  clearFilter(): void {
    this.teamName = "";
    this.fetchBarchartDetails();
  }

  createBarChart() {
    if (this.chart) this.chart.destroy();
    this.chart = new Chart('barChartInterview', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Counts',
          data: this.dataSet,
          backgroundColor: 'rgba(98, 138, 252)',
          borderColor: 'rgba(98, 138, 252)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: false,
            }
          },
          x: {
            grid: {
              display: false,
            }
          }
        },
        layout: {
          padding: {
            top: 60,
            right: 10,
            bottom: 10,
            left: 10,
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
          },
          datalabels: {
            display: false
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }

  dateChange(event: any): void {
    let date = new Date(event?.value);
    this.displayDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.currentPage = 1;
    this.pageSize = 10;
    this.fetchInterviewCounts();
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.fetchInterviewCounts();
  }

}
