import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-application-list-bar',
  templateUrl: './application-list-bar.component.html',
  styleUrls: ['./application-list-bar.component.css'],
  providers: [DatePipe],
})
export class ApplicationListBarComponent implements OnInit {
  @Input() positionId: string = '';
  chart: any;
  applicationList: any[] = [];
  labels: any;
  dataSet: any;
  requestId: any;
  today: Date = new Date();
  limit: number = 10;
  currentPage: number = 1;
  startDate: string | null = this.datePipe.transform(new Date(Date.now() - 31 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  endDate: string | null = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  lastPage: any;
  totalCount: any;
  initialLoader: boolean = false;
  loader: boolean = false
  constructor(private apiService: ApiService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.initialLoader = true;
     // Retrieve the last page from localStorage (if available)
     const savedPage = localStorage.getItem('currentPageInterviewStatus');
     this.currentPage = savedPage ? parseInt(savedPage, 10) : 1;
    this.requestId = this.positionId ? this.positionId : '';
    this.fetchApplicationList(this.currentPage);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['positionId'] && !changes['positionId'].isFirstChange()) {
      this.requestId = changes['positionId'].currentValue;
      this.limit = 10;
      this.currentPage = 1;
      this.fetchApplicationList(this.currentPage);
    }
  }

  ngAfterViewInit(): void {
    Chart.register(ChartDataLabels);
  }

  fetchApplicationList(page:any): void {
    if(page) this.currentPage = page;
    if (!this.initialLoader) this.loader = true;
    this.applicationList = [];
    this.apiService.get(`/dashboard/department-daily-application?fromDate=${this.startDate}&toDate=${this.endDate}&limit=${this.limit}&currentPage=${this.currentPage}&requestId=${this.requestId}`).subscribe((res: any) => {
      if (res?.data) {
        this.applicationList = res?.data;
        this.totalCount = res?.dataCount;
        const totalPages = Math.ceil(this.totalCount / this.limit);
        this.lastPage = totalPages;
        this.initialLoader = false;
        this.loader = false;
        if (this.currentPage > totalPages) this.currentPage = totalPages;
      }
    });
    localStorage.setItem('currentPageInterviewStatus', this.currentPage.toString());
  }

  dateChange(event: any, range: string): void {
    let date = new Date(event?.value);
    if (range == 'startDate') this.startDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    if (range == 'endDate') this.endDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.positionId = '';
    this.limit = 10;
    this.currentPage = 1;
    this.fetchApplicationList(this.currentPage);
  }

}
