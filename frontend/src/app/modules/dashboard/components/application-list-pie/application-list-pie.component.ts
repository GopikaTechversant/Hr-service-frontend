import { AfterViewInit, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-application-list-pie',
  templateUrl: './application-list-pie.component.html',
  styleUrls: ['./application-list-pie.component.css'],
  providers: [DatePipe],
})
export class ApplicationListPieComponent implements OnInit, AfterViewInit {
  @Input() positionId: any;
  @Input() startDate: any;
  @Input() endDate: any;

  chart: any;
  sourceList: any[] = [{}];
  sourceLabels: string[] = [];
  sourceCount: number[] = [];
  requestId: any;
  today: Date = new Date();
  initialLoader: Boolean = false;

  constructor(private apiService: ApiService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.initialLoader = true;
    this.requestId = this.positionId ? this.positionId : '';
    this.fetchResumeSource();
  }

  ngAfterViewInit(): void {
    Chart.register(ChartDataLabels);
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['positionId'] && !changes['positionId'].isFirstChange()) {
      if (this.positionId === '') this.fetchResumeSource();
      this.requestId = changes['positionId'].currentValue;
      this.fetchResumeSource();
    } else if (changes['startDate'] && !changes['startDate'].isFirstChange()) {
      this.startDate = changes['startDate'].currentValue;
      this.fetchResumeSource();
    } else if (changes['endDate'] && !changes['endDate'].isFirstChange()) {
      this.endDate = changes['endDate'].currentValue;
      this.fetchResumeSource();
    }
  }
  fetchResumeSource(): void {
    this.initialLoader = true;
    this.sourceList = [];
    this.sourceLabels = [];
    this.sourceCount = [];
    this.apiService.get(`/dashboard/resume-source?fromDate=${this.startDate}&toDate=${this.endDate}&requestId=${this.requestId}`).subscribe((res: any) => {
      if (res?.data && res.data.length > 0) {
        this.sourceList = res.data;
        this.sourceLabels = this.sourceList.map((item: any) => item.sourceName);
        this.sourceCount = this.sourceList.map((item: any) => Number(item.sourcecount));
        this.initialLoader = false
        setTimeout(() => {
          this.createChart();
        }, 10);
      } else {
        this.initialLoader = false;
        this.sourceList = [];
        this.sourceLabels = [];
        this.sourceCount = [];
      }    
    });
  }
  
  createChart(): void {
    const canvasElement = document.getElementById('MyChart') as HTMLCanvasElement;
    if (!canvasElement) {
      return; 
    }
  
    if (this.chart) {
      this.chart.destroy();
    }
  
    if (!this.sourceList || this.sourceList.length === 0) {
      console.warn("No data available for the chart");
      return; 
    }
  
    const chartConfig: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: this.sourceLabels,
        datasets: [{
          data: this.sourceCount,
          backgroundColor: ['#6E4F7B', '#1782A3', '#F5C767', '#9FD66A', '#628AFC'],
          borderColor: ['#6E4F7B', '#1782A3', '#F5C767', '#9FD66A', '#628AFC'],
          fill: false,
          hoverOffset: 5
        }],
      },
      options: {
        responsive: true,
        aspectRatio: 1.9,
        layout: {
          padding: 10
        },
        plugins: {
          legend: {
            display: true,
            position: 'right',
            align: 'center',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20
            }
          },
          tooltip: {
            enabled: true
          },
          datalabels: {
            display: true,
            color: 'white',
            font: {
              size: 16,  // Increase font size
              weight: 'bold',  // Make text bold
            }
          },
        },
      },
      plugins: [ChartDataLabels],
    };
    this.chart = new Chart(canvasElement, chartConfig);
  }
 
}
