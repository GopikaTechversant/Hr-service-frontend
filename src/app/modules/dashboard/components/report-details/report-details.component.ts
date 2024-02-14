import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { environment } from 'src/environments/environments';
@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.css']
})
export class ReportDetailsComponent implements OnInit {
  chart: any;
  reportUserId: any = '';
  currentYear: any = '';
  reportMonth: any = '';
  userRequirement: any;
  requirementDetail: any;
  totalReport: any;
  requirementDetailData: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.reportUserId = localStorage.getItem('userId');
    this.currentYear = new Date().getFullYear();;
    this.fetchDetails();
  }

  ngAfterViewInit(): void {
    Chart.register(ChartDataLabels);
  }

  fetchDetails(): void {
    this.http.get(`${environment.api_url}/report/month-report-data?month=${this.currentYear}-02&userId=13`)
      .subscribe((res: any) => {
        this.userRequirement = [];
        this.userRequirement = res?.data;
        this.totalReport = res?.totalReportMonth[0]
        for (let requirement of this.userRequirement) {
          this.requirementDetail = requirement;
          if (this.userRequirement.length > 0) {
            const requirementDetail = this.userRequirement[this.userRequirement.length - 1];
            this.requirementDetailData = [
              requirementDetail.sourcedScreened ?? '0',
              requirementDetail.candidateContacted ?? '0',
              requirementDetail.candidatesIntrested ?? '0',
              requirementDetail.interviewScheduled ?? '0',
              requirementDetail.offerReleased ?? '0'
            ];
          } else {
            this.requirementDetailData = ['0', '0', '0', '0', '0'];
          }
        }
        this.createChart(); 
      });
  }
  createChart() {
    this.chart = new Chart("Chart", {
      type: 'doughnut',
      data: {
        labels: ['Resumes Sourced & Screened by Recruiter', 'Candidates Contacted by Recruiter', 'Interested candidates', 'Interviews scheduled', 'Offers released'],
        datasets: [{
          data: this.requirementDetailData,
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
