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
          label: 'Applicants',
          data: [274, 17, 31],
          backgroundColor: [
            '#628afc',
            '#005ec9',
            '#047892',     
          ],
          // hoverOffset: 4
        }],
      },
      options: {
        aspectRatio: 1.7,
        plugins: {
          datalabels: {
            color: '#575F6E', 
            backgroundColor: '#edeff5',
            borderRadius: 4, 
            borderColor: '#ffffff', 
            borderWidth: 1, 
            padding: 4, 
            anchor: 'end', 
            align: 'end', 
            offset: -10, 
            font: {
              size: 10, 
              weight: 'bold',
            },
            formatter: (value, context) => {
              if (context.chart.data.labels !== undefined) {
                return context.chart.data.labels[context.dataIndex] + ': ' + value;
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
