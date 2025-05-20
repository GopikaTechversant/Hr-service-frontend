import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environments';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { EditComponent } from '../edit/edit.component';
@Component({
  selector: 'app-candidate-details',
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.css'],
})
export class CandidateDetailsComponent implements OnInit {
  candidateId: any;
  candidateDetails: any;
  resumePath: any;
  CandidateData: any;
  candidateFeedback: any;
  currentRequirement: any;
  env_url: string = '';
  activeTab: string = 'basic';
  positionId: any;
  showPrevious: boolean = false;
  currentRequirementIndex: number = 0;
  viewResumeFile: any;
  CandidateHistory: any;
  initialLoader: boolean = false;
  loader: boolean = false;
  positonIds: any;
  userRole: any = localStorage.getItem('userRole');
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.initialLoader = true;
    this.route.paramMap.subscribe((params) => {
      this.candidateId = params.get('id');
      this.fetchCandidateDetails();
    });
    this.env_url = window.location.origin;
  }
  fetchCandidateDetails(): void {
    if (!this.initialLoader) this.loader = true;
    this.apiService.get(`/candidate/list/${this.candidateId}`).subscribe({
      next: (res: any) => {
        if (res?.data) {
          this.initialLoader = false;
          this.loader = false;
          this.CandidateData = res?.data;
          this.candidateDetails = res?.data?.[0];
          this.candidateFeedback = res.comments;
          this.currentRequirement =
            this.candidateDetails?.position?.[0]?.reqServiceRequest?.requestName;
          this.positonIds = this.candidateDetails?.position.map(
            (pos: any) => pos?.reqServiceRequest?.requestId
          );
          this.resumePath = this.candidateDetails?.candidateResume;
          if (this.resumePath) this.viewResumeFile = environment.s3_url;
          if (this.positonIds?.length !== 0) this.fetchCandidateHistory();
        }
      },
      error: (err) => {
        this.initialLoader = false;
        this.loader = false;
      },
    });
  }
  fetchCandidateHistory(): void {
    const url = window.location.href;
    const queryString = url.split('?')[1];
    let requestId: string | null = null;
    if (queryString) {
      const params = queryString.split('&');
      for (const param of params) {
        const [key, value] = param.split('=');
        if (key === 'requestId') {
          requestId = value;
          break;
        }
      }
    }
    if (!this.initialLoader) this.loader = true;
    this.CandidateHistory = [];
    let apiUrl = `/candidate/candidate-history?`;
    const apiParams = [];
    if (this.candidateId) {
      apiParams.push(`candidateId=${this.candidateId}`);
    }
    if (this.candidateDetails?.candidateEmail) {
      apiParams.push(`email=${this.candidateDetails.candidateEmail}`);
    }
    if (requestId) {
      apiParams.push(`requestId=${requestId}`);
    }
    apiUrl += apiParams.join('&');
   if(requestId != '0') {
     this.apiService.get(apiUrl).subscribe({
      next: (res: any) => {
        if (res) {
          this.initialLoader = false;
          this.loader = false;
          this.CandidateHistory = res?.history;
        }
      },
      error: (err) => {
        this.initialLoader = false;
        this.loader = false;
      },
    });
   }
  }
  selectedTab(event: any, tabName: string): void {
    this.activeTab = tabName;
  }
  viewResume(resume: any) {
    this.resumePath = resume;
    window.open(`${environment.s3_url}${this.resumePath}`, '_blank');
    this.viewResumeFile = environment.s3_url;
  }
  edit(id: any): void {
    const dialogRef = this.dialog.open(EditComponent, {
      data: id,
      width: '950px',
      height: '700px',
    });
    dialogRef.componentInstance.onEditSuccess.subscribe(() => {});
  }
  handleModalClose(isClosed: boolean): void {
    if (isClosed) {
      this.fetchCandidateDetails();
    }
  }
}
