import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-interview-count',
  templateUrl: './interview-count.component.html',
  styleUrls: ['./interview-count.component.css'],
  providers: [DatePipe],
})
export class InterviewCountComponent implements OnInit {
  chart: any;
  displayDate: any;
  currentLimit: any = 4;
  currentpage: number = 1;
  list: any = [
    {
      name: 'Amritha',
      count: 4,
      conducted: 6,
      update: '1st shortlisted'
    },
    {
      name: 'Devika',
      count: 4,
      conducted: 6,
      update: '1st shortlisted'
    },
    {
      name: 'Anna',
      count: 4,
      conducted: 6,
      update: '1st shortlisted'
    },
    {
      name: 'Dev',
      count: 4,
      conducted: 6,
      update: '1st shortlisted'
    },
    {
      name: 'Amritha',
      count: 4,
      conducted: 6,
      update: '1st shortlisted'
    },
    {
      name: 'Amritha',
      count: 4,
      conducted: 6,
      update: '1st shortlisted'
    },
  ]
 
  constructor(private datePipe: DatePipe) { }
  ngOnInit(): void {
   this.createBarChart();
  }
  createBarChart() {
    this.chart = new Chart('barChartInterview', {
      type: 'bar',
      data: {
        labels: ['Aug 2023', 'Sept 2023', 'Oct 2023', 'Nov 2023', 'Dec 2023'],
        datasets: [{
          label: 'Counts',
          data: [5, 10, 15, 20, 30],
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
  dateChange(event: any): void {
    let date = new Date(event?.value);
    this.displayDate = this.datePipe.transform(date, 'yyyy-MM-dd');
  }
  pageChange(event: any): void {
    let skip = parseInt(event, 10);
    this.currentpage = skip;
  }
 
}
