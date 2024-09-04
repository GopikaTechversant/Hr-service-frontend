import { DatePipe } from '@angular/common';
import { Component, HostListener, Input, OnInit, SimpleChanges } from '@angular/core';
import { Chart, ChartTypeRegistry, TooltipItem } from 'chart.js/auto';
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
  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: any) {
  //   $event.returnValue = true; 
  // }

  ngOnInit(): void {
    this.initialLoader = true;
    this.requestId = this.positionId ? this.positionId : '';
    this.fetchApplicationList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['positionId'] && !changes['positionId'].isFirstChange()) {
      this.requestId = changes['positionId'].currentValue;
      this.limit = 10;
      this.currentPage = 1;
      this.fetchApplicationList();
    }
  }

  ngAfterViewInit(): void {
    Chart.register(ChartDataLabels);
  }

  fetchApplicationList(): void {
    if(!this.initialLoader) this.loader = true;
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

  dateChange(event: any, range: string): void {
    let date = new Date(event?.value);
    if (range == 'startDate') this.startDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    if (range == 'endDate') this.endDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.positionId = '';
    this.limit = 10;
    this.currentPage = 1;
    this.fetchApplicationList();
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.limit = 10;
    this.fetchApplicationList();
  }


  // createBarChart() {
  //   if (this.chart) {
  //     this.chart.destroy();
  //   }
  //   this.chart = new Chart('barChart', {
  //     type: 'bar',
  //     data: {
  //       labels: this.labels,
  //       datasets: [{
  //         label: ' ',
  //         data: this.dataSet,
  //         backgroundColor: 'rgba(98, 138, 252)',
  //         borderColor: 'rgba(98, 138, 252)',
  //         borderWidth: 1,
  //         barThickness: 30,  
  //         // maxBarThickness: 50,  
  //         barPercentage: 1, 
  //         categoryPercentage: 0.9, 
  //       }],
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //           grid: {
  //             display: false,  // Ensure grid lines are displayed
  //             // drawBorder: true,
  //             drawOnChartArea: true,
  //             drawTicks: true,
  //           },
  //           ticks: {
  //             stepSize: 5,  // Fixed step size for uniform scaling
  //             precision: 0  // Avoids floating point numbers in ticks
  //           }
  //         },
  //         x: {
  //           grid: {
  //             display: false
  //           },
  //           ticks: {
  //             autoSkip: false,
  //             maxRotation: 0, // Allow labels to rotate to avoid overlapping
  //             minRotation: 0,
  //             stepSize: 5,
  //              // ticks: {
  //           //   autoSkip: false,
  //           //   maxRotation: 0,
  //           //   minRotation: 0,
  //             // callback: function (value, index, values) {
  //             //   const stringValue = value.toString();
  //             //   const maxLabelLength = 10;
  //             //   if (stringValue.length > maxLabelLength) {
  //             //     return stringValue.match(new RegExp('.{1,' + maxLabelLength + '}', 'g'));
  //             //   }
  //             //   return stringValue;
  //             // }
  //           // }
  //           }
  //         }
  //       },
  //       layout: {
  //         padding: {
  //           top: 30,
  //           right: 10,
  //           bottom: 10,
  //           left: 10
  //         }
  //       },
  //       plugins: {
  //         legend: {
  //           display: false
  //         },
  //         tooltip: {
  //           enabled: true,
  //           callbacks: {
  //             title: function (tooltipItems: TooltipItem<keyof ChartTypeRegistry>[]) {
  //               if (tooltipItems.length) {
  //                 const index = tooltipItems[0].dataIndex;
  //                 const labels = this.chart.data.labels as string[];
  //                 if (labels && index < labels.length) {
  //                   return labels[index];
  //                 }
  //               }
  //               return '';
  //             }
  //           }
  //         },
  //         datalabels: {
  //           color: '#0034C4',
  //           backgroundColor: '#FFFFFF',
  //           borderRadius: 4,
  //           borderColor: '#0034C4',
  //           borderWidth: 1,
  //           padding: 4,
  //           anchor: 'end',
  //           align: 'end',
  //           offset: -1,
  //           font: {
  //             size: 11,
  //             weight: 400,
  //           },
  //           formatter: (value: any, context: any) => {
  //             if (context.chart && context.chart.data.labels && context.dataIndex < context.chart.data.labels.length) {
  //               return value + ' Applicants';
  //             }
  //             return 'Unknown: ' + value;
  //           },
  //         },
  //       }
  //     },
  //     plugins: [ChartDataLabels],
  //   });

  //   const barChartElement = document.getElementById('barChart');
  //   if (barChartElement && barChartElement.parentElement) {
  //     barChartElement.parentElement.style.overflowX = 'auto';
  //     barChartElement.style.minWidth = `${this.labels.length * 40}px`;  // Adjust the 50px value based on your needs
  //   }
  // }

}
