import { Component, OnInit } from '@angular/core';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-interview-counts-bar',
  templateUrl: './interview-counts-bar.component.html',
  styleUrls: ['./interview-counts-bar.component.css'],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
})
export class InterviewCountsBarComponent implements OnInit {
  chart: any;
  sixMonthCount: any;
  labels: any;
  dataSet: any;
  teamDetails: any;
  showDepartment: boolean = false;
  teamId: any = '';
  teamName: string = '';
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    Chart.register(ChartDataLabels);
    this.fetchBarchartDetails();
    this.fetchDepartment();
  }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.showDepartment = false;
    }
  }

  fetchBarchartDetails(): void {
    this.apiService.get(`/dashboard/six-month-count?team=${this.teamId}`).subscribe((res: any) => {
      if (res?.data) {
        this.sixMonthCount = res?.data;
        this.labels = Object.keys(this.sixMonthCount[0]);
        this.dataSet = Object.values(this.sixMonthCount[0]);
        this.createBarChart();
      }
    })
  }

  fetchDepartment(): void {
    this.apiService.get(`/service-request/team`).subscribe((res: any) => {
      if (res?.data) {
        this.teamDetails = res?.data
      }
    })
  }

  selectDepartment(team: string, teamId: string): void {
    this.teamName = team;
    this.teamId = teamId;
    this.showDepartment = false;
    this.fetchBarchartDetails();
  }

  clearFilter(): void {
    this.teamName = "";
    this.fetchBarchartDetails();
  }

  createBarChart() {
    if (this.chart) this.chart.destroy();
    this.chart = new Chart('barChartInterview', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Counts',
          data: this.dataSet,
          backgroundColor: 'rgba(98, 138, 252)',
                  borderColor: 'rgba(98, 138, 252)',
                  borderWidth: 1,
                  barThickness: 40,  
                  barPercentage: 1, 
                  categoryPercentage: 0.9, 
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
            }
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
                return value + ' Interviews';
              }
              return 'Unknown: ' + value;
            },
          },
        }
      },
      plugins: [ChartDataLabels],
    });
  }

}
