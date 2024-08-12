import { Component, Input, OnInit, OnChanges, SimpleChanges, AfterViewInit, HostListener } from '@angular/core';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';
import { ApiService } from 'src/app/services/api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-interview-counts-bar',
  templateUrl: './interview-counts-bar.component.html',
  styleUrls: ['./interview-counts-bar.component.css'],
  providers: [DatePipe]
})
export class InterviewCountsBarComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() startDate: any;
  @Input() endDate: any;
  @Input() positionId: any;
  chart: any;
  sixMonthCount: any[] = [];
  labels: any[] = [];
  hiredData: any[] = [];
  sourcedData: any[] = [];
  offeredData: any[] = [];
  recruiterCheck: boolean = true;
  lastSixMonth: boolean = false;
  previousStartDate: any;
  previousEndDate: any;
  requestId: any;

  constructor(private apiService: ApiService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    Chart.register(ChartDataLabels);
    this.previousStartDate = this.startDate;
    this.previousEndDate = this.endDate;
    this.fetchBarchartDetails();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['positionId'] && !changes['positionId'].isFirstChange()) {
      this.requestId = changes['positionId'].currentValue;
      this.fetchBarchartDetails();
    } else if (changes['startDate'] && !changes['startDate'].isFirstChange()) {
      this.startDate = changes['startDate'].currentValue;
      this.endDate = this.previousEndDate;
      this.lastSixMonth = false;
      this.recruiterCheck = true;
      this.fetchBarchartDetails();
    } else if (changes['endDate'] && !changes['endDate'].isFirstChange()) {
      this.endDate = changes['endDate'].currentValue;
      this.startDate = this.previousStartDate;
      this.lastSixMonth = false;
      this.recruiterCheck = true;
      this.fetchBarchartDetails();
    }
  }

  ngAfterViewInit(): void {
    // Ensure that the chart is created only after the view has fully initialized
    this.tryCreateChart();
  }
  
  tryCreateChart() {
    // Ensure the canvas element exists before creating the chart
    setTimeout(() => {
      const canvasElement = document.getElementById('barChartInterview') as HTMLCanvasElement;
      if (canvasElement && this.sixMonthCount.length) {
        this.createBarChart();
      } else {
        console.warn('Canvas element not found or no data available for the chart.');
      }
    }, 0);
  }
  
  fetchBarchartDetails(): void {
    this.sixMonthCount = [];
    const url = '/dashboard/recruiter-chart';
    let params = [
      `start_date=${this.startDate}`,
      `end_date=${this.endDate}`,
      `last_six_month=${this.lastSixMonth}`,
      `recruiter=${this.recruiterCheck}`,
      `requestId=${this.requestId}`
    ].filter(param => param.split('=')[1] !== '').join('&');
  
    this.apiService.get(`${url}?${params}`).subscribe((res: any) => {
      if (res?.data) {
        this.sixMonthCount = res.data;
        this.labels = this.sixMonthCount.map((item: any) => item.userfirstName ?? item.month);
        this.hiredData = this.sixMonthCount.map((item: any) => +item.total_hired);
        this.sourcedData = this.sixMonthCount.map((item: any) => +item.total_totalsourced);
        this.offeredData = this.sixMonthCount.map((item: any) => +item.total_offerreleased);
        this.tryCreateChart(); // Updated to call tryCreateChart
      }
    });
  }
  
  onRadioChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.value === 'Last 6 Months') {
      this.recruiterCheck = false;
      this.lastSixMonth = true;
      this.endDate = '';
      this.startDate = '';
      this.fetchBarchartDetails();
    } else if (target.value === 'recruiter') {
      this.startDate = this.previousStartDate;
      this.endDate = this.previousEndDate;
      this.recruiterCheck = true;
      this.lastSixMonth = false;
      this.fetchBarchartDetails();
    }
  
    this.tryCreateChart(); // Updated to call tryCreateChart
  }
  
  @HostListener('document:click', ['$event'])
  onBodyClick(event: Event): void {
  }
  
  createBarChart(): void {
    if (this.chart) this.chart.destroy();

    const canvasElement = document.getElementById('barChartInterview') as HTMLCanvasElement;
    if (!canvasElement) {
      console.error('Canvas element not found');
      return;
    }

    this.chart = new Chart(canvasElement, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'No. of Hired',
            data: this.hiredData,
            backgroundColor: '#047892',
            borderColor: '#047892',
            borderWidth: 1,
            barPercentage: 0.8,
            categoryPercentage: 0.7,
            barThickness: 30,
            clip: { left: 5, top: 8, right: -2, bottom: 0 }
          },
          {
            label: 'No. of Offered',
            data: this.offeredData,
            backgroundColor: '#2870B8',
            borderColor: '#2870B8',
            borderWidth: 1,
            barPercentage: 0.8,
            categoryPercentage: 0.7,
            barThickness: 30,
            clip: { left: 5, top: 1, right: -2, bottom: 0 }
          },
          {
            label: 'No. of Sourced',
            data: this.sourcedData,
            backgroundColor: '#3EB2B8',
            borderColor: '#3EB2B8',
            borderWidth: 1,
            barPercentage: 0.9,
            categoryPercentage: 0.7,
            barThickness: 30,
            clip: { left: 5, top: 1, right: -2, bottom: 0 }
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            stacked: true,
            // beginAtZero: true,
            type: 'logarithmic',
            grid: {
              display: false
            },

          },
          x: {
            stacked: true,
            grid: {
              display: false
            },
            min: 0,
            max: this.labels.length > 5 ? 5 : this.labels.length,
          }
        },
        layout: {
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
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
            color: '#FFFFFF',
            padding: 4,
            anchor: 'center',
            align: 'center',
            offset: -1,
            font: {
              size: 14,
              weight: 400
            }
          }
        },
        onClick: (e, elements) => {
          if (elements.length) {
            const index = elements[0].index;
            const chartInstance = this.chart;
            if (chartInstance) {
              chartInstance.options.scales.x.min = index - 2 < 0 ? 0 : index - 2;
              chartInstance.options.scales.x.max = index + 3 > this.labels.length ? this.labels.length : index + 3;
              chartInstance.update();
            }
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  }
}
