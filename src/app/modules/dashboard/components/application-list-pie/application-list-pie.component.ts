import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-application-list-pie',
  templateUrl: './application-list-pie.component.html',
  styleUrls: ['./application-list-pie.component.css']
})
export class ApplicationListPieComponent implements OnInit {
  chart: any;

  ngOnInit(): void {
    this.createChart(); 
  }

  createChart() {
    this.chart = new Chart("MyChart", {
      type: 'doughnut',
      data: {
        labels: ['Naukiri', 'Indeed', 'LinkedIn'],
        datasets: [{
          label: 'My First Dataset',
          data: [274, 17, 31],
          backgroundColor: [
            '#628afc',
            '#005ec9',
            '#047892',     
          ],
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio: 1.9
      }
    });
  }
}
