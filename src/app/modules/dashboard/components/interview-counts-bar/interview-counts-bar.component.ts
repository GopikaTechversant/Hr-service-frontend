import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';
import { ApiService } from 'src/app/services/api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-interview-counts-bar',
  templateUrl: './interview-counts-bar.component.html',
  styleUrls: ['./interview-counts-bar.component.css'],
  providers: [DatePipe],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
})
export class InterviewCountsBarComponent implements OnInit {
  chart: any;
  sixMonthCount: any;
  labels: any;
  dataSets: any[] = [];
  teamDetails: any;
  showDepartment: boolean = false;
  teamId: any = '';
  teamName: string = '';
  barcounts: any[] = [];
  @Input() startDate: any;
  @Input() endDate: any;
  label: any[] = [];
  hiredData: any[] = [];
  sourcedData: any[] = [];
  offeredData: any[] = [];
  recruiterCheck: boolean = false;
  previousStartDate: any;
  previousEndDate: any;
  constructor(private apiService: ApiService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    Chart.register(ChartDataLabels);
    this.fetchBarchartDetails();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['startDate'] && !changes['startDate'].isFirstChange()) {
      this.startDate = changes['startDate'].currentValue;
      this.fetchBarchartDetails();
    } else if (changes['endDate'] && !changes['endDate'].isFirstChange()) {
      this.endDate = changes['endDate'].currentValue
      this.fetchBarchartDetails();
    }
  }

  ngAfterViewInit(): void {
    Chart.register(ChartDataLabels);
  }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.showDepartment = false;
    }
  }

  onRadioChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.value === 'Last 6 Months') {
      this.recruiterCheck = false;
      const currentDate = new Date();
      const sixMonthsAgo = new Date(currentDate);
      sixMonthsAgo.setMonth(currentDate.getMonth() - 5);
      this.previousStartDate = this.startDate;
      this.previousEndDate = this.endDate;
      this.endDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
      this.startDate = this.datePipe.transform(sixMonthsAgo, 'yyyy-MM-dd');
      this.fetchBarchartDetails();
    } else if (target.value === 'recruiter') {
      this.recruiterCheck = true;
      if (this.previousStartDate && this.previousEndDate) {
        this.startDate = this.previousStartDate;
        this.endDate = this.previousEndDate;
      }
      this.fetchBarchartDetails();
    }
  }

  fetchBarchartDetails(): void {
    this.apiService.get(`/dashboard/recruiter-chart?end_date=${this.endDate}&start_date=${this.startDate}&recruiter=${this.recruiterCheck}`).subscribe((res: any) => {
      if (res?.data) {
        this.sixMonthCount = res.data;
        this.labels = this.sixMonthCount.map((item: any) => item.userfirstName);
        this.hiredData = this.sixMonthCount.map((item: any) => +item.total_hired);
        this.sourcedData = this.sixMonthCount.map((item: any) => +item.total_totalsourced);
        this.offeredData = this.sixMonthCount.map((item: any) => +item.total_offerreleased);
        this.createBarChart();
      }
    });
  }

  createBarChart(): void {
    if (this.chart) this.chart.destroy();
    this.chart = new Chart('barChartInterview', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'No. of Hired',
            data: this.hiredData, // Adjust data values accordingly
            backgroundColor: '#047892',
            borderColor: '#047892',
            borderWidth: 1,
            barPercentage: 0.8,
            categoryPercentage: 0.7,
          },
          {
            label: 'No. of Sourced',
            data: this.sourcedData, // Adjust data values accordingly
            backgroundColor: '#628AFC',
            borderColor: '#628AFC',
            borderWidth: 1,
            barPercentage: 0.8,
            categoryPercentage: 0.7,
          },
          {
            label: 'No. of Offered',
            data: this.offeredData, // Adjust data values accordingly
            backgroundColor: '#005EC9',
            borderColor: '#005EC9',
            borderWidth: 1,
            barPercentage: 0.8,
            categoryPercentage: 0.7,
          },

        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {

            }
          },
          x: {
            beginAtZero: false,
            grid: {
              display: false,
            }
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
            // position: 'right',
            // align: 'end',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
            }
          },
          tooltip: {
            enabled: true,
          },
          datalabels: {
            color: '#575F6E',
            // backgroundColor: '#FFFFFF',
            // borderRadius: 4,
            // borderColor: '#0034C4',
            // borderWidth: 1,
            padding: 4,
            anchor: 'end',
            align: 'end',
            offset: -1,
            font: {
              size: 14,
              weight: 400,
            },
            // formatter: (value: any, context: any) => {
            //   return value + ' Interviews';
            // },
          },
        }
      },
      plugins: [ChartDataLabels],
    });
  }
}
