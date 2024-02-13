import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.css']
})
export class ReportDetailsComponent {
  list = [
    {
      count1: 250, name1: 'Total Resumes sourced & screened',
      count2: 1185, name2: 'Candidates contacted by the recruiter',
      count3: 784, name3: 'Interested candidates',
      count4: 3254, name4: 'Interviews scheduled',
      count5: 1, name5: 'Total ApplicantsOffer Released',
    },

  ];
  chart: any;

  ngAfterViewInit(): void {
    Chart.register(ChartDataLabels);
    this.createChart();
  }

  createChart() {
    this.chart = new Chart("MyChart", {
      type: 'doughnut',
      data: {
        labels: ['Resumes Sourced & Screened by Recruiter', 'Candidates Contacted by Recruiter', 'Interested candidates', 'Interviews scheduled', 'Offers released'],
        datasets: [{
          data: [274, 17, 31, 45, 98],
          backgroundColor: ['#FA4679', '#F57C02', '#628afc', '#047892', '#005ec9'],
          fill: false
        }],
      },
      options: {
        responsive: true, 
        aspectRatio: 2.2,
        layout: {
          padding: {
            top: 20,
            right: 10,
            bottom: 20,
            left: 10
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              usePointStyle: true,
              padding: 20 
            }
          },
          tooltip: {
            enabled: false    
          },
          datalabels: {
            color: '#FFFFFF',
            padding: 0,
            anchor: 'center',
            align: 'center',
            offset: -10,
            font: {
              size: 15,
              weight: 'bold',     
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }
}
