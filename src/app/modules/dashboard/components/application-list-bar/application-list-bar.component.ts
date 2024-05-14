import { DatePipe } from '@angular/common';
import { Component, HostListener, Input, OnInit, SimpleChanges } from '@angular/core';
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
  startDate: string | null = this.datePipe.transform(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  endDate: string | null = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  constructor(private apiService: ApiService, private datePipe: DatePipe) { }
  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: any) {
  //   $event.returnValue = true; 
  // }

  ngOnInit(): void {
    this.requestId = this.positionId ? this.positionId : '';
    this.fetchApplicationList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.positionId) {
      this.requestId = this.positionId;
      this.fetchApplicationList();
    }
  }

  ngAfterViewInit(): void {
    Chart.register(ChartDataLabels);
  }

  fetchApplicationList(): void {
    this.apiService.get(`/dashboard/department-daily-application?fromDate=${this.startDate}&toDate=${this.endDate}&requestId=${this.requestId}`).subscribe((res: any) => {
      if (res?.data) {
        this.applicationList = res?.data;
        this.labels = this.applicationList.map((app: any) => app.requestName);
        this.dataSet = this.applicationList.map((app: any) => app.applicationCount);
        this.createBarChart();
      }
    });
  }

  dateChange(event: any, range: string): void {
    let date = new Date(event?.value);
    if (range == 'startDate') this.startDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    if (range == 'endDate') this.endDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.positionId = '';
    this.fetchApplicationList();
  }

  createBarChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          label: ' ',
          data: this.dataSet,
          backgroundColor: 'rgba(98, 138, 252)',
          borderColor: 'rgba(98, 138, 252)',
          borderWidth: 1,
          barThickness: 40,
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
            },
            // ticks: {
            //   autoSkip: false,
            //   maxRotation: 0,
            //   minRotation: 0,
            //   callback: function (value, index, values) {
            //     const stringValue = value.toString();
            //     const maxLabelLength = 10;
            //     if (stringValue.length > maxLabelLength) {
            //       return stringValue.match(new RegExp('.{1,' + maxLabelLength + '}', 'g'));
            //     }
            //     return stringValue;
            //   }
            // }
          }
        },
        layout: {
          padding: {
            top: 30,
            right: 10,
            bottom: 10,
            left: 10
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            // callbacks: {
            //   title: function (tooltipItems: TooltipItem<keyof ChartTypeRegistry>[]) {
            //     if (tooltipItems.length) {
            //       const index = tooltipItems[0].dataIndex;
            //       const labels = this.chart.data.labels as string[];
            //       if (labels && index < labels.length) {
            //         return labels[index];
            //       }
            //     }
            //     return '';
            //   }
            // }
          },
          datalabels: {
            color: '#0034C4',
            backgroundColor: '#FFFFFF',
            borderRadius: 4,
            borderColor: '#0034C4',
            borderWidth: 1,
            padding: 4,
            anchor: 'end',
            align: 'end',
            offset: -1,
            font: {
              size: 11,
              weight: 400,
            },
            formatter: (value: any, context: any) => {
              if (context.chart && context.chart.data.labels && context.dataIndex < context.chart.data.labels.length) {
                return value + ' Applicants';
              }
              return 'Unknown: ' + value;
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }

}
