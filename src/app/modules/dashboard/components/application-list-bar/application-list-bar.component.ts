import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-application-list-bar',
  templateUrl: './application-list-bar.component.html',
  styleUrls: ['./application-list-bar.component.css']
})
export class ApplicationListBarComponent implements OnInit {
  chart: any;

  constructor() { }

  ngOnInit(): void {
    Chart.register(ChartDataLabels);
    this.createBarChart();
  }

  createBarChart() {
    this.chart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: [ 'SE/SSE- Java', 'SE/SSE - Node JS', 'TL - .NET ', 'SE/SSE- PHP', 'SE/SSE- DBA', 'TL - Automation'],
        datasets: [{
          label: ' ',
          data: [44,21, 50, 15, 25, 30],
          backgroundColor: 'rgba(98, 138, 252)',
          borderColor: 'rgba(98, 138, 252)', 
          borderWidth: 1
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
            right: 20,
            bottom: 20,
            left: 20
          }
        },
        plugins: {        
          legend: {
            display: false 
          },
          tooltip: {
            enabled: false
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
            formatter: (value, context) => {
              if (context.chart.data.labels !== undefined) {
                return value + ' Applicants';
              }
              return 'Unknown: ' + value;
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }


}
