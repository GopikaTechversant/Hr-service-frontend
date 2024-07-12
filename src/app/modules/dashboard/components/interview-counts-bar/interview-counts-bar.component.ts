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
  dataSets: any[] = [];
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
        this.sixMonthCount = res.data;
        // http://localhost:3001/dashboard/recruiter-chart?end_date=2024-08-01&start_date=2024-06-01
        //   this.labels = Object.keys(this.sixMonthCount[0]);
        //   this.dataSets = this.sixMonthCount.map((item: any, index: number) => ({
        //     label: `Series ${index + 1}`, // Adjust the label as needed
        //     data: Object.values(item),
        //     backgroundColor: `rgba(98, 138, 252, ${0.6 + index * 0.1})`,
        //     borderColor: `rgba(98, 138, 252, ${0.6 + index * 0.1})`,
        //     borderWidth: 1,
        //     barThickness: 40,
        //     barPercentage: 1,
        //     categoryPercentage: 0.9,
        //   }));
        this.createBarChart();
      }
    });
  }

  fetchDepartment(): void {
    this.apiService.get(`/service-request/team`).subscribe((res: any) => {
      if (res?.data) {
        this.teamDetails = res.data;
      }
    });
  }

  selectDepartment(team: string, teamId: string): void {
    this.teamName = team;
    this.teamId = teamId;
    this.showDepartment = false;
    this.fetchBarchartDetails();
  }

  clearFilter(): void {
    this.teamName = '';
    this.fetchBarchartDetails();
  }

  createBarChart(): void {
    if (this.chart) this.chart.destroy();
    this.chart = new Chart('barChartInterview', {
      type: 'bar',
      data: {
        labels: ['Amritha', 'Jiji', 'Maloo', 'Parvathy'],
        datasets: [
          {
            label: 'No. of Hired',
            data: [4, 4, 2, 0], // Adjust data values accordingly
            backgroundColor: '#047892',
            borderColor: '#047892',
            borderWidth: 1,
            barPercentage: 0.8,
            categoryPercentage: 0.7,
          },
          {
            label: 'No. of Sourced',
            data: [12, 13, 11, 14], // Adjust data values accordingly
            backgroundColor: '#628AFC',
            borderColor: '#628AFC',
            borderWidth: 1,
            barPercentage: 0.8,
            categoryPercentage: 0.7,
          },
          {
            label: 'No. of Offered',
            data: [5, 4, 3, 1], // Adjust data values accordingly
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
