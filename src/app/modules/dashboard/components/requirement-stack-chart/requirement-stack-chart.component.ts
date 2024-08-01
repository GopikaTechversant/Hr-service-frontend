import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';
import { ApiService } from 'src/app/services/api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-requirement-stack-chart',
  templateUrl: './requirement-stack-chart.component.html',
  styleUrls: ['./requirement-stack-chart.component.css']
})
export class RequirementStackChartComponent {
  @Input() startDate: any;
  @Input() endDate: any;
  @Input() positionId: any;
  chart: any;
  sixMonthCount: any;
  labels: any;
  dataSets: any[] = [];
  teamDetails: any;
  showDepartment: boolean = false;
  teamId: any = '';
  teamName: string = '';
  barcounts: any[] = [];
  label: any[] = [];
  hiredData: any[] = [];
  sourcedData: any[] = [];
  offeredData: any[] = [];
  recruiterCheck: boolean = true;
  lastSixMonth : boolean = false
  previousStartDate: any;
  previousEndDate: any;
  requestId: any;
  constructor(private apiService: ApiService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    Chart.register(ChartDataLabels);
    this.fetchBarchartDetails();
    this.previousStartDate = this.startDate
    this.previousEndDate = this.endDate
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['positionId'] && !changes['positionId'].isFirstChange())) {
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
      this.lastSixMonth = true;
      this.endDate = '';
      this.startDate = '';
      this.fetchBarchartDetails();
    } else if (target.value === 'recruiter') {
      this.startDate = this.previousStartDate;
      this.endDate = this.previousEndDate;
      this.recruiterCheck = true;
      this.lastSixMonth = true;      
      this.fetchBarchartDetails();
    }
  }

  fetchBarchartDetails(): void {
    const url = '/dashboard/recruiter-chart';
    let params = [
      `start_date=${this.startDate }`,
      `end_date=${this.endDate}`,
      `last_six_month=${this.lastSixMonth}`,
      `recruiter=${this.recruiterCheck}`,
      `end_date=${this.endDate}`,
      `requestId=${this.requestId}`
    ].filter(param => param.split('=')[1] !== '').join('&');  
   
    this.apiService.get(`${url}?${params}`).subscribe((res: any) => {
      if (res?.data) {
        this.sixMonthCount = res.data;
        // this.labels = this.sixMonthCount.map((item: any) => item.userfirstName ?? item.month);
        this.labels = ['deapertment name','deapertment name','deapertment name','deapertment name','deapertment name' ]
        this.hiredData = this.sixMonthCount.map((item: any) => +item.total_hired);
        this.sourcedData = this.sixMonthCount.map((item: any) => +item.total_totalsourced);
        this.offeredData = this.sixMonthCount.map((item: any) => +item.total_offerreleased);        
        this.createBarChart();
      }
    });
  }

  createBarChart(): void {
    if (this.chart) this.chart.destroy();
    this.chart = new Chart('barChartRecruiter', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'No.of Hired',
            data: ['5' ,' 4' , '2', '7'], 
            backgroundColor: '#047892',
            borderColor: '#047892',
            borderWidth: 1,
            barPercentage: 0.8,
            categoryPercentage: 0.7,
            barThickness:90,       
            clip: {left: 5, top: 8, right: -2, bottom: 0}
     
          },
          {
            label: 'No.of Offred',
            data: ['5' ,' 7' , '6', '7'], 
            backgroundColor: '#598e9c',
            borderColor: '#598e9c',
            borderWidth: 1,
            barPercentage: 0.8,
            categoryPercentage: 0.7,
            barThickness:90,       
            clip: {left: 5, top: 8, right: -2, bottom: 0}
     
          },
          
          {
            label: 'Technical Selected',
            data: ['10' ,' 8' , '7', '9'], 
            backgroundColor: '#005EC9',
            borderColor: '#005EC9',
            borderWidth: 1,
            barPercentage: 0.8,
            categoryPercentage: 0.7,
            barThickness: 90,  
            clip: {left: 5, top: 1, right: -2, bottom: 0}

          },
          {
            label: 'Total Applicants',
            data: ['17' ,' 18' , '20', '19'], 
            backgroundColor: '#628AFC',
            borderColor: '#628AFC',
            borderWidth: 1,
            barPercentage: 0.9,
            categoryPercentage: 0.7,
            barThickness: 90,  
            clip: {left: 5, top: 1, right: -2, bottom: 0}
          },

        ]
      },
      options: {
        scales: {
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: {

            }
          },
          x: {
            stacked: true,
            beginAtZero: false,
            grid: {
              display: false,
            }
          },
          
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
            color: '#FFFFFF',
            // backgroundColor: '#FFFFFF',
            // borderRadius: 4,
            // borderColor: '#0034C4',
            // borderWidth: 1,
            padding: 4,
            anchor: 'center',
            align: 'center',
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
