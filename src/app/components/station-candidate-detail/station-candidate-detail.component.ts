import { Component, Inject, OnInit, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { S3Service } from 'src/app/services/s3.service';
import { ToastrServices } from 'src/app/services/toastr.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-station-candidate-detail',
  templateUrl: './station-candidate-detail.component.html',
  styleUrls: ['./station-candidate-detail.component.css'],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
})
export class StationCandidateDetailComponent implements OnInit {
  private keySubscription?: Subscription;
  uploadedFileKey: string = '';
  candidateDetails: any;
  showRequest: boolean = false;
  progessAdded: boolean = false;
  serviceId: any = null
  stationId: any;
  feedback: any;
  userId: any;
  resumePath: any;
  file: File | null = null;
  fileName: any;
  messageType: string = '';
  showSelection: boolean = false;
  showRejection: boolean = false;
  isEditable: boolean = false;
  today: Date = new Date();
  templateData: any;
  feedbackCc: string = '';
  htmlString: string = '';
  feedbackSubject: string = '';
  content: any;
  buttonType: string = '';
  mailTemplateData: any;
  status: any;
  filteredStatus: string = '';
  filterStatus: boolean = false;
  loader: boolean = false;
  env_url: string = '';
  url: any;
  currentStation: string = '';
  rejectionFeedbackList: any;
  openRejectionFeedback: boolean = false;
  selectedRejectionFeedback: string = '';
  progressSkill:any;
  statusMessages: { [key: string]: string } = {
    done: 'Candidate Selected to Next Round',
    rejected: 'Candidate Rejected In this Round',
    moved: 'Candidate Moved From this Round',
    'back-off': 'Candidate Back-off In this Round',
    'pannel-rejection': 'Panel Rejected the candidate'
  };
  constructor(public dialogRef: MatDialogRef<StationCandidateDetailComponent>, private apiService: ApiService, private tostr: ToastrServices, private s3Service: S3Service,
    private route: ActivatedRoute, private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.candidateDetails = data?.candidateDetails;
      this.stationId = data?.stationId;
      this.serviceId = this.candidateDetails?.serviceId;
      this.progressSkill = this.candidateDetails?.skillScore
      if (data?.offerStatus > 0) this.progessAdded = true;
    }
    this.dialogRef.updateSize('60vw', '90vh');
    this.templateData = { message: '' };
  }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.filterStatus = false;
    }
  }

  ngOnInit(): void {
    this.currentStation = this.router.url.split('/')[1];
    this.route.params.subscribe(params => {
      this.stationId = params['id'];
      this.url = `/technical/${this.stationId}`;
    });
    this.stationId = localStorage.getItem('currentStationId');
    this.userId = localStorage.getItem('userId');
    this.env_url = window.location.origin;
    this.fetchFeedbackList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);

    // if(this.modalClose) this.fetchList();
    // if (changes['modalClose'] && !changes['modalClose'].isFirstChange()) this.fetchList();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  selectButton(type: any): void {
    this.buttonType = type;
    if (type === 'rejection') this.fetchStatus();
  }

  fetchFeedbackList(): void {
    this.apiService.get(`/screening-station/rejection-list`).subscribe(res => {
      this.rejectionFeedbackList = res?.data;
    });
  }

  fetchStatus(): void {
    this.apiService.get(`/user/filter-status`).subscribe(res => {
      this.status = res?.data.slice(4);
    });
  }

  selectStatusFilter(status: string) {
    this.filteredStatus = status;
  }

  selectRejectionFeedback(status: string) {
    this.selectedRejectionFeedback = status;
  }


  onFileSelected(event: any): void {
    const file: File = event?.target?.files?.[0];
    if (file) {
      this.file = file;
      this.fileName = file?.name;
      this.loader = true;
      if (this.fileName) this.s3Service.uploadImage(this.file, 'hr-service-images', this.file);
      this.getKeyFroms3();
    }
  }

  // onFileSelected(event: any): void {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     this.file = file;
  //     this.fileName = file?.name;
  //   }
  // }


  getKeyFroms3(): void {
    this.keySubscription = this.s3Service.key.subscribe((key: string) => {
      this.uploadedFileKey = key;
      if (!this.uploadedFileKey) {
        this.loader = false;
        this.tostr.error('Something Went Wrong Please Try Again');
      } else {
        this.loader = false;
        this.tostr.success('File upload Successfully');
      }
    });
  }

  onSubmitInterviewData(data: any) {
    if (data) {
      this.loader = true;
      const payload = {
        progressAssignee: this.userId,
        progressServiceId: this.serviceId?.toString() || '0',
        progressDescription: data?.progressDescription || '',
        progressSkill: data?.progressSkill,
        file: data?.file || '',
      };

      const baseUrlMap: { [key: string]: string } = {
        'written': '/written-station',
        'management': '/management-station',
        'technical-3': '/technical-station',
        'technical-4': '/technical-station-two'
      };

      const baseUrl = baseUrlMap[`${this.currentStation}-${this.stationId}`] || baseUrlMap[this.currentStation];

      if (!baseUrl) {
        this.tostr.error('Invalid operation');
        this.loader = false;
        return;
      }

      if (baseUrl) {
        this.apiService.post(`${baseUrl}/add-progress/v1`, payload).subscribe({
          next: () => {
            this.loader = false;
            this.tostr.success('Progress added successfully');
            this.closeDialog();
          },
          error: () => {
            this.loader = false;
            this.tostr.warning('Unable to Update Progress');
          }
        });
      } else {
        this.loader = false;
        this.tostr.error('Invalid operation');
      }
    }
  }

  showMail(item: string): void {
    if (item === 'approve') this.showSelection = true;
    if (item === 'rejection') this.showRejection = true;
    this.messageType = item;
    if (item.trim() !== '') {
      this.mailTemplateData = {
        firstName: this.candidateDetails['candidate.candidateFirstName'],
        lastName: this.candidateDetails['candidate.candidateLastName'],
        id: this.candidateDetails['candidate.candidateId'],
        messageType: this.messageType,
        stationId: this.stationId,
      };
    }

  }

  onSubmitData(event: any): void {
    if (event?.clickType === 'cancel') this.cancelClick();
    if (event?.messageType === 'approve') this.approveClick(event);
    if (event?.messageType === 'rejection') this.rejectClick(event);
    if (event?.messageType === 're-schedule') this.rescheduleClick(event);
  }

  cancelClick(): void {
    this.closeDialog();
  }

  rescheduleClick(data: any): void {
    this.loader = true;
    const payload = {
      candidateId: this.candidateDetails['candidate.candidateId'],
      position: this.candidateDetails['serviceRequest.requestId'],
      interviewTime: data?.interviewTime,
      interViewPanel: data?.interviewPanel,
      interviewMode: data?.interviewMode,
      serviceId: this.candidateDetails?.serviceId,
      station: this.stationId,
      interviewStatus: data?.interviewStatus,
      comments: data?.feedback,
      interviewCc: data?.mailCc,
      interviewMailTemp: data?.mailTemp,
      interviewSubject: data?.mailSubject,
      interviewBcc: data?.mailBcc,
    }

    this.apiService.post(`/screening-station/interview-details`, payload).subscribe({
      next: (res: any) => {
        this.loader = false;
        this.tostr.success('Interview Re-Scheduled Successfully');
        this.closeDialog();
      },
      error: (error) => {
        this.loader = false;
        if (error?.status === 500) this.tostr.error("Internal Server Error");
        else this.tostr.warning("Unable to update");
      }
    });
    this.showMail('');
  }

  approveClick(data: any): void {
    this.loader = true;

    const baseUrlMap: { [key: string]: string } = {
      'written': '/written-station',
      'management': '/management-station',
      'technical-3': '/technical-station',
      'technical-4': '/technical-station-two'
    };

    const baseUrl = baseUrlMap[`${this.currentStation}-${this.stationId}`] || baseUrlMap[this.currentStation];

    if (!baseUrl) {
      this.tostr.error('Invalid operation');
      this.loader = false;
      return;
    }

    const payload = {
      serviceSeqId: this.serviceId,
      feedBack: data?.feedback,
      feedBackBy: this.userId,
      feedBackCc: data?.mailCc,
      feedBackMailTemp: data?.mailTemp || '',
      feedBackSubject: data?.mailSubject,
      feedBcc: data?.mailBcc,
      date: data?.interviewTime,
      pannelUser: data?.interviewPanel,
      interviewMode: data?.interviewMode,
      requestionId: this.candidateDetails['serviceRequest.requestId']
    };
    this.apiService.post(`${baseUrl}/approve`, payload).subscribe({
      next: () => {
        this.tostr.success('Candidate Selected to Next Round');
        this.closeDialog();
        this.loader = false;
      },
      error: () => {
        this.tostr.error('Error during approval');
        this.loader = false;
      },
      complete: () => {
        this.loader = false;
      }
    });
  }

  rejectClick(data: any): void {
    this.loader = true;
    const feedback = document.getElementById('feedback') as HTMLInputElement;
    if (feedback) this.feedback = feedback?.value;
    if (this.filteredStatus || data) {
      const payload = {
        serviceId: this.serviceId,
        stationId: this.stationId,
        userId: this.userId,
        status: this.filteredStatus ? this.filteredStatus : "rejected",
        rejectCc: data?.mailCc ?? '',
        rejectMailTemp: data?.mailTemp ?? '',
        rejectSubject: data?.mailSubject ?? '',
        rejectBcc: data?.mailBcc ?? '',
        feedBack: data?.feedback ? data?.feedback : this.selectedRejectionFeedback,
      };
      this.apiService.post(`/screening-station/reject/candidate`, payload).subscribe({
        next: (res: any) => {
          this.loader = false;
          this.closeDialog();
        },
        error: (error) => {
          this.loader = false;
          this.tostr.error('Error adding progress');
        }
      });
    }
  }

  viewResume(resume: any) {
    this.resumePath = resume;
    window.open(`${environment.s3_url}${this.resumePath}`, '_blank');
  }

  ngOnDestroy(): void {
    if (this.keySubscription) {
      this.keySubscription.unsubscribe();
    }
  }
}
