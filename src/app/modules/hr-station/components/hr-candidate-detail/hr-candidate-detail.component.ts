import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { S3Service } from 'src/app/services/s3.service';
import { ToastrServices } from 'src/app/services/toastr.service';
import { environment } from "src/environments/environments";
@Component({
  selector: 'app-hr-candidate-detail',
  templateUrl: './hr-candidate-detail.component.html',
  styleUrls: ['./hr-candidate-detail.component.css'],
  providers: [DatePipe],
})
export class HrCandidateDetailComponent {
  @ViewChild('template', { static: false }) templateRef!: ElementRef;
  private keySubscription?: Subscription;
  serviceId: number = 0;
  candidateDetails: any;
  today: Date = new Date();
  hrReview: any;
  feedback: any;
  userId: any;
  resumePath: any;
  messageType: string = '';
  fileName: string = '';
  mailTemplateData: any;
  loader: boolean = false;
  env_url: string = '';
  buttonType: string = '';
  status: any;
  currentStation: any;
  stationId: any;
  url: any;
  progessAdded: boolean = false;
  requestDetails: any;
  offerSent: boolean = false;
  filterStatus: boolean = false;
  filteredStatus: string = '';
  showMailTemp: boolean = false;
  constructor(public dialogRef: MatDialogRef<HrCandidateDetailComponent>, private apiService: ApiService, private tostr: ToastrServices, private s3Service: S3Service,
    private route: ActivatedRoute, private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.candidateDetails = data?.candidateDetails?.candidate;
      this.requestDetails = data?.candidateDetails?.serviceRequest;
      this.hrReview = data?.candidateDetails?.reqHrReview;
      this.serviceId = this.data?.candidateDetails?.serviceId;
      this.feedback = data?.candidateDetails?.reqCandidateComment?.commentComment;
      if (data?.offerStatus > 0) this.offerSent = true;
    }
    this.dialogRef.updateSize('60%', '85%')
  }

  ngOnInit(): void {
    this.currentStation = this.router.url.split('/')[1];
    this.route.params.subscribe(params => {
      this.stationId = params['id'];
      this.url = `/technical/${this.stationId}`;
    });
    this.stationId = this.router.url.split('/')[2];
    this.today = new Date();
    this.userId = localStorage.getItem('userId');
    this.env_url = window.location.origin;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  showMail(item: string): void {
    // this.showOffer = item === 'offer';
    // if (item === 're-schedule') this.showReschedule = true;
    // if (item === 'rejection') this.showRejection = true;
    this.showMailTemp = true;
    this.messageType = item;
    if (item.trim() !== '') {
      this.mailTemplateData = {
        firstName: this.candidateDetails?.candidateFirstName,
        lastName: this.candidateDetails?.candidateLastName,
        id: this.candidateDetails?.candidateId,
        messageType: this.messageType,
        stationId: this.stationId,
      };
    }
  }

  selectButton(type: any): void {
    this.buttonType = type;
  }

  onSubmitData(event: any): void {
    if (event?.clickType === 'cancel') this.cancelClick();
    if (event?.messageType === 'offer') this.addOffer(event);
    if (event?.messageType === 'rejection') this.rejectClick(event);
  }

  addOffer(data: any): void {
    this.loader = true;
    const payload = {
      offerServiceSeqId: this.serviceId,
      offerSalary: data?.offerSalary,
      offerDescription: data?.feedback,
      offerJoinDate: data?.joiningdate,
      offerMailTemp: data?.mailTemp,
      offerMailSubject: data?.mailSubject,
      offerMailBackCc: data?.mailCc,
      offerMailBackBcc: data?.mailBcc,
      offerRleasedBy: this.userId,
      attachmentArray: [{
        filename: data?.file,
        path: `${environment.s3_url}${data?.file}`
      }]
    };

    this.apiService.post(`/hr-station/candidateOffer`, payload).subscribe({
      next: (res: any) => {
        this.loader = false;
        this.tostr.success('Offer Added Successfully');
        this.closeDialog();
      },
      error: (error) => {
        this.loader = false;
        this.tostr.error('Error adding progress');
      }
    });
  }

  cancelClick(): void {
    this.closeDialog();
  }

  viewResume(resume: any): void {
    this.resumePath = resume;
    const resumeUrl = `${environment.s3_url}${this.resumePath}`;
    window.open(resumeUrl, '_blank');
  }

  rejectClick(data: any): void {
    const feedback = document.getElementById('feedback') as HTMLInputElement;
    if (feedback) this.feedback = feedback?.value;
    if (this.feedback.trim() !== '' || data) {
      this.loader = true;
      const payload = {
        serviceId: this.serviceId,
        stationId: '5',
        userId: this.userId,
        status: "rejected",
        rejectCc: data?.mailCc ?? '',
        rejectMailTemp: data?.mailTemp ?? '',
        rejectSubject: data?.mailSubject ?? '',
        rejectBcc: data?.mailBcc ?? '',
        feedBack: this.feedback,
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
    } else this.tostr.warning('Please Add Feedback');

  }

  approveClick(): void {
    const feedbackElement = document.getElementById('feedback') as HTMLInputElement;
    const feedback = feedbackElement?.value.trim();
    if (feedback) {
      this.loader = true;
      this.feedback = feedback;
      const payload = {
        serviceSeqId: this.serviceId,
        feedBack: this.feedback,
        feedBackBy: this.userId
      };

      this.apiService.post(`/hr-station/candidateToUser`, payload).subscribe({
        next: (res: any) => {
          this.loader = false;
          this.tostr.success('Approval successful');
          this.closeDialog();
        },
        error: (error) => {
          this.loader = false;
          this.tostr.error('Error during approval')
        }
      });
    } else {
      this.tostr.warning('Please Add Feedback');
    }
  }

}
