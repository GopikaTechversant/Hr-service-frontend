import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart, registerables } from 'chart.js';
import { ApiService } from 'src/app/services/api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-requirement-stack-chart',
  templateUrl: './requirement-stack-chart.component.html',
  styleUrls: ['./requirement-stack-chart.component.css']
})
export class RequirementStackChartComponent implements OnInit, OnChanges {
  @Input() startDate: string | null = null;
  @Input() endDate: string | null = null;
  @Input() positionId: string | null = null;
  
  chart: Chart | null = null;
  sixMonthCount: any;
  labels: string[] = [];
  dataSets: any[] = [];
  teamDetails: any;
  showDepartment: boolean = false;
  teamId: string = '';
  teamName: string = '';
  barcounts: number[] = [];
  label: string[] = [];
  hiredData: number[] = [];
  sourcedData: number[] = [];
  offeredData: number[] = [];
  selectedDepartment: string = '';
  recruiterCheck: boolean = true;
  lastSixMonth: boolean = false;
  previousStartDate: string | null = null;
  previousEndDate: string | null = null;
  requestId: string | null = null;
  departmentList: any;
  teamListOpen: boolean = false;
  selectedTeamId: string = '';
  barchartList: any;
  technicalData: number[] = [];
  
  constructor(private apiService: ApiService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    Chart.register(...registerables, ChartDataLabels);
    this.previousStartDate = this.startDate;
    this.previousEndDate = this.endDate;
    this.fetchServiceTeam();
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

  fetchServiceTeam(): void {
    this.apiService.get(`/service-request/team`).subscribe((res: any) => {
      if (res?.data) {
        this.departmentList = res.data;
      }
    });
  }

  selectTeam(teamId: string, teamName: string): void {
    this.teamListOpen = false;
    this.selectedDepartment = teamName;
    this.selectedTeamId = teamId;
    this.fetchBarchartDetails();
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

  clearFilter(): void {
    this.teamListOpen = false
    this.selectedDepartment = '';
    this.selectedTeamId = '';
    this.fetchBarchartDetails();
  }

  fetchBarchartDetails(): void {
    this.apiService.get(`/dashboard/department-chart?teamId=${this.selectedTeamId}`).subscribe((res: any) => {    
      if (res) {
        this.barchartList = res;
        console.log(  this.barchartList);

        this.labels = this.barchartList.map((item: any) => item.requestName ?? item.teamName);
        console.log(this.labels);
        this.hiredData = this.barchartList.map((item: any) => +item.hire_count);
        this.sourcedData = this.barchartList.map((item: any) => +item.total_applicant);
        this.offeredData = this.barchartList.map((item: any) => +item.offered_Count);
        this.technicalData = this.barchartList.map((item: any) => +item.technical_selected_Count);
        this.createBarChart();
      }
    });
  }

  createBarChart(): void {
    if (this.chart) {
        this.chart.destroy();
    }

    const baseWidth = 1000;
    const labelWidth = 40; // Adjust this value to suit your design needs
    const chartWidth = this.labels.length * labelWidth > baseWidth ? this.labels.length * labelWidth : baseWidth;
  
    const chartContainer = document.querySelector('.chart-inner-container') as HTMLElement;
    chartContainer.style.width = `${chartWidth}px`;
    
    const canvasElement = document.getElementById('barChartRecruiter') as HTMLCanvasElement;
    canvasElement.width = chartWidth; // Adjust canvas width to container's width
    canvasElement.height = 400; // Set a
    this.chart = new Chart(canvasElement, {
        type: 'bar',
        data: {
            labels: this.labels,
            datasets: [
                {
                    label: 'No.of Hired',
                    data: this.hiredData,
                    backgroundColor: '#047892',
                    borderColor: '#047892',
                    borderWidth: 1,
                    barPercentage: 0.6,
                    categoryPercentage: 0.5,
                    barThickness: 20,
                    clip: { left: 5, top: 8, right: -2, bottom: 0 }
                },
                {
                    label: 'No.of Offered',
                    data: this.offeredData,
                    backgroundColor: '#598e9c',
                    borderColor: '#598e9c',
                    borderWidth: 1,
                    barPercentage: 0.6,
                    categoryPercentage: 0.5,
                    barThickness: 20,
                    clip: { left: 5, top: 8, right: -2, bottom: 0 }
                },
                {
                    label: 'Technical Selected',
                    data: this.technicalData,
                    backgroundColor: '#005EC9',
                    borderColor: '#005EC9',
                    borderWidth: 1,
                    barPercentage: 0.6,
                    categoryPercentage: 0.5,
                    barThickness: 20,
                    clip: { left: 5, top: 1, right: -2, bottom: 0 }
                },
                {
                    label: 'Total Applicants',
                    data: this.sourcedData,
                    backgroundColor: '#628AFC',
                    borderColor: '#628AFC',
                    borderWidth: 1,
                    barPercentage: 0.6,
                    categoryPercentage: 0.5,
                    barThickness: 20,
                    clip: { left: 5, top: 1, right: -2, bottom: 0 }
                },
            ]
        },
        options: {
            scales: {
                y: {
                    stacked: true,
                    beginAtZero: true
                },
                x: {
                    stacked: true,
                    beginAtZero: false,
                    grid: {
                        display: false
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
            }
        },
        plugins: [ChartDataLabels]
    });
}

}
