import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-application-list-bar',
  templateUrl: './application-list-bar.component.html',
  styleUrls: ['./application-list-bar.component.css']
})
export class ApplicationListBarComponent implements OnInit {
  chart: any;

  constructor() { }

  ngOnInit(): void {
    this.createBarChart();
  }

  createBarChart() {
    this.chart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['SE/SSE- Java', 'SE/SSE - Node JS', 'TL - .NET ', 'SE/SSE- PHP', 'SE/SSE- DBA', 'TL - Automation'],
        datasets: [{
          label: 'Applicants',
          data: [0, 5, 10, 15, 25],
          backgroundColor: [
            'rgba(98, 138, 252)',
            'rgba(98, 138, 252)',
            'rgba(98, 138, 252)',
            'rgba(98, 138, 252)',
            'rgba(98, 138, 252)',
            'rgba(98, 138, 252)',
          ],
          borderColor: [
            'rgba(98, 138, 252)',
            'rgba(98, 138, 252)',
            'rgba(98, 138, 252)',
            'rgba(98, 138, 252)',
            'rgba(98, 138, 252)',
            'rgba(98, 138, 252)',
          ],
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
        }
      }
    });
  }
  

}
