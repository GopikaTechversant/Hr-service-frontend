import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ToastrServices } from 'src/app/services/toastr.service';
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
  selectedMonth: string = 'Select Month';
  showMonth: boolean = false;
  monthData: any[] = [
    { month: 'January', number: '01' },
    { month: 'February', number: '02' },
    { month: 'March', number: '03' },
    { month: 'April', number: '04' },
    { month: 'May', number: '05' },
    { month: 'June', number: '06' },
    { month: 'July', number: '07' },
    { month: 'August', number: '08' },
    { month: 'September', number: '09' },
    { month: 'October', number: '10' },
    { month: 'November', number: '11' },
    { month: 'December', number: '12' }
  ];
  recruiters: any;
  showRecruiters: boolean = false;
  recruiterName: string = 'Select Recruiters';
  error: boolean = false;

  constructor(private tostr: ToastrServices, private http: HttpClient, private renderer: Renderer2, private el: ElementRef) { }
  onBodyClick(event: Event): void {
    console.log(event);
      const targetElement = event.target as HTMLElement;
  
    if (!targetElement.closest('.no-close')) {
      this.showRecruiters = false;
      this.showMonth = false;
    }
  }
  

  ngOnInit(): void {
    this.reportUserId = localStorage.getItem('userId');
    this.currentYear = new Date().getFullYear();
    this.reportMonth = new Date().getMonth() + 1
    this.fetchDetails();
    this.fetchRecruiters();
  }

  ngAfterViewInit(): void {
    Chart.register(ChartDataLabels);
  }

  fetchRecruiters(): void {
    this.http.get(`${environment.api_url}/dashboard/recruiter-list`)
      .subscribe((res: any) => {
        this.recruiters = res?.data;
      });
  }

  fetchDetails(): void {
    this.http.get(`${environment.api_url}/report/month-report-data?month=${this.currentYear}-${this.reportMonth}&userId=${this.reportUserId}`)
      .subscribe(
        (res: any) => {
          this.userRequirement = [];
          this.userRequirement = res?.data;
          this.totalReport = res?.totalReportMonth[0];
          for (let requirement of this.userRequirement) {
            this.requirementDetail = requirement;
            if (this.userRequirement.length > 0) {
              const requirementDetail = this.userRequirement[this.userRequirement.length - 1];
              this.requirementDetailData = [
                requirementDetail.sourcedScreened ?? '0',
                requirementDetail.candidateContacted ?? '0',
                requirementDetail.candidatesInterested ?? '0',
                requirementDetail.interviewScheduled ?? '0',
                requirementDetail.offerReleased ?? '0'
              ];
            } else {
              this.requirementDetailData = ['0', '0', '0', '0', '0'];
            }
          }
          this.createChart();
        },
        (error) => { 
          if (error?.status === 500) this.tostr.error("Internal Server Error");
          else {
            this.tostr.warning(error?.error?.message ? error?.error?.message : "Unable to fetch details");
            this.error = true;
          }
        }
      );
  }
  

  selectMonth(monthNumber: string, month: string): void {
    this.reportMonth = monthNumber;
    this.selectedMonth = month;
    this.showMonth = false;
    this.fetchDetails();
  }

  selectRecruiter(recruiter: string, recruiterId: string): void {
    this.recruiterName = recruiter;
    this.reportUserId = recruiterId;
    this.showRecruiters = false;
    this.fetchDetails();
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }
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
