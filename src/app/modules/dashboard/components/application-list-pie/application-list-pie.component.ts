import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';


@Component({
  selector: 'app-application-list-pie',
  templateUrl: './application-list-pie.component.html',
  styleUrls: ['./application-list-pie.component.css']
})
export class ApplicationListPieComponent implements OnInit {
  chart: any;

  ngOnInit(): void {
    Chart.register(ChartDataLabels);
    this.createChart();
  }

  createChart() {
    this.chart = new Chart("MyChart", {
      type: 'doughnut',
      data: {
        labels: ['Naukiri', 'Indeed', 'LinkedIn'],
        datasets: [{
          data: [274, 17, 31],
          backgroundColor: ['#628afc', '#005ec9', '#047892'],
          fill: false
        }],
      },
      options: {
        aspectRatio: 1.9,
        layout: {
          padding: {
            top: 40,
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
            color: (context) => {
              const backgroundColor = context.chart.data.datasets[0].backgroundColor;
              if (Array.isArray(backgroundColor)) {
                return backgroundColor[context.dataIndex] || '#000';
              }
              return '#000';
            },
            padding: 4,
            anchor: 'end',
            align: 'end',
            offset: 10, 
            font: {
              size: 14,
              weight: 'bold',
            },
            formatter: (value, context) => {
              const square = '▮ ';
              if (context.chart.data.labels && typeof context.dataIndex === 'number') {
                return `${square}${context.chart.data.labels[context.dataIndex]}: ${value}`;
              }
              return `${square}Unknown ${value}`;
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }

}
