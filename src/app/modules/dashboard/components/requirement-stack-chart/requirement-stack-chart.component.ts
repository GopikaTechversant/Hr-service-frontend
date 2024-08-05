import { Component, Input, OnInit, SimpleChanges, OnChanges, AfterViewInit } from '@angular/core';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart, registerables } from 'chart.js';
import { ApiService } from 'src/app/services/api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-requirement-stack-chart',
  templateUrl: './requirement-stack-chart.component.html',
  styleUrls: ['./requirement-stack-chart.component.css']
})
export class RequirementStackChartComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() startDate: string | null = null;
  @Input() endDate: string | null = null;
  @Input() positionId: string | null = null;

  chart: Chart | null = null;
  labels: string[] = [];
  hiredData: number[] = [];
  offeredData: number[] = [];
  technicalData: number[] = [];
  totalApplicants: number[] = [];
  departmentList: any;
  selectedDepartment: string = '';
  teamListOpen: boolean = false;
  selectedTeamId: string = '';

  constructor(private apiService: ApiService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    Chart.register(...registerables, ChartDataLabels);
    this.fetchServiceTeam();
    this.fetchBarchartDetails();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['positionId'] && !changes['positionId'].isFirstChange()) {
      this.fetchBarchartDetails();
    } else if (changes['startDate'] && !changes['startDate'].isFirstChange()) {
      this.fetchBarchartDetails();
    } else if (changes['endDate'] && !changes['endDate'].isFirstChange()) {
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
    const canvasElement = document.getElementById('barChartRecruiter') as HTMLCanvasElement;
    if (canvasElement) {
        this.createBarChart();
    } else {
        console.error('Canvas element not found!');
    }
}

  clearFilter(): void {
    this.teamListOpen = false;
    this.selectedDepartment = '';
    this.selectedTeamId = '';
    this.fetchBarchartDetails();
  }

  fetchBarchartDetails(): void {
    this.apiService.get(`/dashboard/department-chart?teamId=${this.selectedTeamId}`).subscribe((res: any) => {
      if (res) {
        const barchartList = res;
        this.labels = barchartList.map((item: any) => item.requestName ?? item.teamName);
        this.hiredData = barchartList.map((item: any) => +item?.hire_count);
        this.totalApplicants = barchartList.map((item: any) => +item?.total_applicant);
        this.offeredData = barchartList.map((item: any) => +item?.offered_Count);
        this.technicalData = barchartList.map((item: any) => +item?.technical_selected_Count);
        this.createBarChart();

        console.log(barchartList[0]);
        
      }
    });
  }

  private measureTextWidth(text: string, font: string): number {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      return 0;
    }
    context.font = font;
    return context.measureText(text).width;
  }
  

  createBarChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    const baseWidth = 900;
    const labelFont = '11px Arial';
  
    let maxLabelWidth = 0;
    for (const label of this.labels) {
      const labelWidth = this.measureTextWidth(label, labelFont);      
      if (labelWidth > maxLabelWidth) {
        maxLabelWidth = labelWidth;
      }      
    }
    const minLabelWidth = 40;
    const chartWidth = Math.max(baseWidth, maxLabelWidth * this.labels.length);    
  
    const chartContainer = document.querySelector('.chart-inner-container') as HTMLElement;
    if (chartContainer) {
      chartContainer.style.width = `${chartWidth}px`;
    } else {
      console.error('Chart container not found!');
    }
  
    const canvasElement = document.getElementById('barChartRecruiter') as HTMLCanvasElement;
    if (canvasElement) {
      canvasElement.width = chartWidth;
      canvasElement.height = 400;
  
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
              barPercentage:0.6,
              categoryPercentage:0.5,
              barThickness: 20
            },
            {
              label: 'No. of Offered',
              data: this.offeredData,
              backgroundColor: '#2870B8',
              borderColor: '#2870B8',
              borderWidth: 1,
              barPercentage:0.6,
              categoryPercentage:0.5,
              barThickness: 20
            },
            {
              label: 'Technical Selected',
              data: this.technicalData,
              backgroundColor: '#3EB2B8',
              borderColor: '#3EB2B8',
              borderWidth: 1,
              barPercentage:0.6,
              categoryPercentage:0.5,
              barThickness: 20
            },
            // {
            //   label: 'Total Applicants',
            //   data: this.totalApplicants,
            //   backgroundColor: '#1790C5',
            //   borderColor: '#1790C5',
            //   borderWidth: 1,
            //   barPercentage:0.6,
            //   categoryPercentage:0.5,
            //   barThickness: 20
            // },
          ]
        },
        options: {
          scales: {
            x: {
              stacked: true,
              beginAtZero: false,
              grid: {
                display: false
              },
              ticks: {
                font: { size: 12 },
                autoSkip: false // Ensure all labels are displayed
              }
            },
            y: {
              stacked: true,
              beginAtZero: false,
              grid: {
                display: true
              },
              ticks: {
                font: { size: 12 },
                autoSkip: false // Ensure all labels are displayed
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
              position: 'bottom',
            align: 'start',
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
    } else {
      console.error('Canvas element not found!');
    }
  }
  

}
