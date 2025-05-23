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
  barchartList: any;
  initialLoader: boolean = false;
  chartWidth: any;

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
    this.initialLoader = true;
    this.labels = [];
    this.hiredData = [];
    this.totalApplicants = [];
    this.offeredData = [];
    this.technicalData = [];
    if (changes['positionId'] && !changes['positionId'].isFirstChange()) {
      if (this.positionId === '') this.fetchBarchartDetails();
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
        this.departmentList = res?.data;
      }
    });
  }

  selectTeam(teamId: string, teamName: string): void {
    this.teamListOpen = false;
    this.selectedDepartment = teamName;
    this.selectedTeamId = teamId;
    if (this.chart) {
      this.chart.destroy();
    }
    this.fetchBarchartDetails();
  }

  ngAfterViewInit(): void {
    Chart.register(ChartDataLabels);
    const canvasElement = document.getElementById('barChartRecruiter') as HTMLCanvasElement;
    if (canvasElement) {
      this.createBarChart();
    }
  }

  clearFilter(): void {
    this.teamListOpen = false;
    this.selectedDepartment = '';
    this.selectedTeamId = '';
    if (this.chart) {
      this.chart.destroy();
    }
    this.fetchBarchartDetails();
  }

  fetchBarchartDetails(): void {
    this.initialLoader = true;
    this.labels = [];
    this.hiredData = [];
    this.totalApplicants = [];
    this.offeredData = [];
    this.technicalData = [];
    this.apiService.get(`/dashboard/department-chart?teamId=${this.selectedTeamId}&start_date=${this.startDate}&end_date=${this.endDate}`).subscribe((res: any) => {
      this.barchartList = res || [];
      if (this.barchartList?.length > 0) {
        this.labels = this.barchartList.map((item: any) => item.teamName ?? item.requestName);
        this.hiredData = this.barchartList.map((item: any) => +item.hire_count || null); // Replace 0 with null
        this.totalApplicants = this.barchartList.map((item: any) => +item.total_applicant || null); // Replace 0 with null
        this.offeredData = this.barchartList.map((item: any) => +item.offered_Count || null); // Replace 0 with null
        this.technicalData = this.barchartList.map((item: any) => +item.technical_selected_Count || null); // Replace 0 with null
        this.initialLoader = false;
        setTimeout(() => {
          this.createBarChart();
        }, 0);
      } else {
        this.labels = [];
        this.hiredData = [];
        this.totalApplicants = [];
        this.offeredData = [];
        this.technicalData = [];
        this.initialLoader = false;
      }
    }, error => {
      console.error("Error fetching bar chart details", error);
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
    this.initialLoader = false;

    if (this.chart) {
      this.chart.destroy();
    }

    const baseWidth = 700;
    const labelFont = '13px Arial';
    const labelPadding = 30;

    // Calculate total width needed based on labels and padding
    let totalLabelWidth = this.labels.reduce((total, label) => {
      return total + this.measureTextWidth(label, labelFont) + labelPadding * 2;
    }, 0);

    if (this.labels?.length > 7) {
      this.chartWidth = Math.max(baseWidth * 2, totalLabelWidth);
    } else {
      this.chartWidth = Math.max(baseWidth, totalLabelWidth);

    }


    const chartContainer = document.querySelector('.chart-inner-container') as HTMLElement;
    if (chartContainer) {
      chartContainer.style.width = `${this.chartWidth}px`;
      chartContainer.style.overflowX = 'auto';
    }

    const canvasElement = document.getElementById('barChartRecruiter') as HTMLCanvasElement;
    if (canvasElement) {
      canvasElement.width = this.chartWidth;
      canvasElement.height = 400;

      this.chart = new Chart(canvasElement, {
        type: 'bar',
        data: {
          labels: this.labels,
          datasets: [
            {
              label: 'Hired',
              data: this.hiredData,
              backgroundColor: '#6E4F7B',
              borderColor: '#6E4F7B',
              borderWidth: 1,
              barPercentage: 0.6,
              categoryPercentage: 0.5,
              barThickness: 40
            },
            {
              label: 'Offered',
              data: this.offeredData,
              backgroundColor: '#1782A3',
              borderColor: '#1782A3',
              borderWidth: 1,
              barPercentage: 0.6,
              categoryPercentage: 0.5,
              barThickness: 40
            },
            {
              label: 'Technical Selected',
              data: this.technicalData,
              backgroundColor: '#F5C767',
              borderColor: '#F5C767',
              borderWidth: 1,
              barPercentage: 0.6,
              categoryPercentage: 0.5,
              barThickness: 40
            },
            {
              label: 'Total Applicants',
              data: this.totalApplicants,
              backgroundColor: '#9FD66A',
              borderColor: '#9FD66A',
              borderWidth: 1,
              barPercentage: 0.6,
              categoryPercentage: 0.5,
              barThickness: 40
            },
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
                  if (this.labels && index < this.labels.length) {
                    return this.labels[index].length > 30 ? `${this.labels[index].substring(0, 30)}...` :  this.labels[index];
                  }
                  return tickValue.toString(); // Default to tick value if out of range
                }
              }
            },
            y: {
              type: 'logarithmic',
              stacked: true,
              // beginAtZero: false,
              grid: {
                display: false,
              },
              ticks: {
                display: true,
                font: { size: 12 },
                // autoSkip: true,
                maxTicksLimit: 10,
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
              display: true,
              color: 'white',
              formatter: function (value: number) {
                return value;
              }
            }
          },
          responsive: true,
          maintainAspectRatio: false,
        }
      });
    }
  }
}
