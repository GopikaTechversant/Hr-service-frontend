import { AfterViewInit, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-application-list-pie',
  templateUrl: './application-list-pie.component.html',
  styleUrls: ['./application-list-pie.component.css'],
  providers: [DatePipe],
})
export class ApplicationListPieComponent implements OnInit, AfterViewInit {
  @Input() positionId: string = ' ';
  chart: any;
  displayDate: any;
  sourceList: any[] = [];
  sourceLabels: any[] = [];
  sourceCount: any[] = [];
  constructor(private apiService: ApiService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.displayDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.fetchResumeSource()
  }

  ngAfterViewInit(): void {
    Chart.register(ChartDataLabels);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.positionId) this.fetchResumeSource();
  }

  fetchResumeSource(): void {
    this.apiService.get(`/dashboard/resume-source?date=${this.displayDate}&requestId=${this.positionId}`).subscribe((res: any) => {
      if (res?.data) {
        this.sourceList = res?.data;
        this.sourceCount = this.sourceList.map((item: any) => Number(item.sourcecount));
        this.sourceLabels = this.sourceList.map((item: any) => item.sourceName)
        this.createChart();
      }
    })
  }

  dateChange(event: any): void {
    let date = new Date(event?.value);
    this.displayDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.positionId = '';
    this.fetchResumeSource();
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart("MyChart", {
      type: 'doughnut',
      data: {
        labels: this.sourceLabels,
        datasets: [{
          data: this.sourceCount,
          backgroundColor: ['#628afc', '#005ec9', '#047892', '#224462', '#0094d4'],
          fill: false
        }],
      },
      options: {
        aspectRatio: 1.9,
        layout: {
          padding: {
            top: 30,
            right: 10,
            bottom: 30,
            left: 10
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          },
          datalabels: {
            color: (context) => {
              const backgroundColor = context.chart.data.datasets[0].backgroundColor;
              if (Array.isArray(backgroundColor)) {
                return backgroundColor[context.dataIndex] || '#000';
              }
              return '#000';
            },
            padding: 4,
            anchor: 'end',
            align: 'end',
            offset: 10,
            font: {
              size: 14,
              weight: 'bold',
            },
            formatter: (value, context) => {
              const square = '▮ ';
              if (context.chart.data.labels && typeof context.dataIndex === 'number') {
                return `${square}${context.chart.data.labels[context.dataIndex]}: ${value}`;
              }
              return `${square}Unknown ${value}`;
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }


}
