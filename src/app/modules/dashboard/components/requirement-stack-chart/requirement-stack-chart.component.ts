import { Component, Input, OnInit, SimpleChanges, OnChanges, AfterViewInit } from '@angular/core';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart, registerables } from 'chart.js';
import { ApiService } from 'src/app/services/api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-requirement-stack-chart',
  templateUrl: './requirement-stack-chart.component.html',
  styleUrls: ['./requirement-stack-chart.component.css'],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
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

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.teamListOpen = false;
    }
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
  
    const baseWidth = 1000;
    const labelFont = '13px Arial';
    const labelPadding = 10; // Padding between labels
  
    // Calculate total width needed based on labels and padding
    let totalLabelWidth = this.labels.reduce((total, label) => {
      return total + this.measureTextWidth(label, labelFont) + labelPadding;
    }, 0);
  
    const chartWidth = Math.max(baseWidth, totalLabelWidth);
  
    const chartContainer = document.querySelector('.chart-inner-container') as HTMLElement;
    if (chartContainer) {
      chartContainer.style.width = `${chartWidth}px`;
      chartContainer.style.overflowX = 'auto'; // Enable horizontal scrolling if needed
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
              barPercentage: 0.6,
              categoryPercentage: 0.5,
              barThickness: 30
            },
            {
              label: 'No. of Offered',
              data: this.offeredData,
              backgroundColor: '#2870B8',
              borderColor: '#2870B8',
              borderWidth: 1,
              barPercentage: 0.6,
              categoryPercentage: 0.5,
              barThickness: 30
            },
            {
              label: 'Technical Selected',
              data: this.technicalData,
              backgroundColor: '#3EB2B8',
              borderColor: '#3EB2B8',
              borderWidth: 1,
              barPercentage: 0.6,
              categoryPercentage: 0.5,
              barThickness: 30
            },
            // {
            //   label: 'Total Applicants',
            //   data: [13 ,133 ,13 ,13 ,14,18],
            //   backgroundColor: '#1790C5',
            //   borderColor: '#1790C5',
            //   borderWidth: 1,
            //   barPercentage: 0.6,
            //   categoryPercentage: 0.5,
            //   barThickness: 30
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
                autoSkip: false,
                maxRotation: 0, // No rotation
                minRotation: 0, // No rotation
                callback: (tickValue: string | number, index: number): string => {
                  // Use the labels array to map tick values to custom labels
                  if (this.labels && index < this.labels.length) {
                    return this.labels[index];
                  }
                  return tickValue.toString(); // Default to tick value if out of range
                }
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
                autoSkip: false
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