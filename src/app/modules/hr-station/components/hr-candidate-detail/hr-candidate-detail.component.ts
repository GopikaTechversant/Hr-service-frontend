import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  descriptionValue: any;
  showDescription: boolean = false;
  serviceId: number = 0;
  candidateDetails: any;
  today: Date = new Date();
  hrReview: any;
  feedback: any;
  userId: any;
  resumePath: any;
  templateData: any;
  showSelection: boolean = false;
  showRejection: boolean = false;
  messageType: string = '';
  isEditable: boolean = false;
  file: File | null = null;
  fileName: string = '';
  content: any;
  htmlString: any;
  mailTemplateData: any;
  uploadedFileKey: string = '';
  constructor(public dialogRef: MatDialogRef<HrCandidateDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService, private datePipe: DatePipe, private tostr: ToastrServices,private s3Service : S3Service) {
    if (data) {
      this.candidateDetails = data?.candidateDetails?.candidate;
      this.hrReview = data?.candidateDetails?.reqHrReview;
      this.serviceId = this.data?.candidateDetails?.serviceId;
      this.feedback = data?.candidateDetails?.reqCandidateComment?.commentComment;      
    }
    this.dialogRef.updateSize('60%', '85%')
  }

  ngOnInit(): void {
    this.today = new Date();
    this.userId = localStorage.getItem('userId');
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  showMail(item: 'offer' | 'rejection'): void {
    this.showSelection = item === 'offer';
    this.showRejection = item !== 'offer';
    const { candidateFirstName = '', candidateLastName = '', candidateId = '' } = this.candidateDetails || {};
    this.messageType = item;
    this.mailTemplateData = {
      firstName: candidateFirstName,
      lastName: candidateLastName,
      id: candidateId,
      messageType: item,
      staionId : '5',
    };
  }

  onSubmitData(event: any): void {
    if (event?.clickType === 'cancel') this.cancelClick();
    if (event?.messageType === 'offer') this.addOffer(event);
    if (event?.messageType === 'rejection') this.rejectClick(event);
  }

  addOffer(data: any): void {
    const payload = {
      offerServiceSeqId: this.serviceId,
      offerSalary: data?.offerSalary,
      offerDescription: this.feedback,
      offerJoinDate: data?.joiningdate,
      offerMailTemp: data?.mailTemp,
      offerMailSubject: data?.mailSubject,
      offerMailBackCc: data?.mailCc,
      offerMailBackBcc: data?.mailBcc,
      attachmentArray : [ {   
        filename:  data?.file ,
        path: `${environment.s3_url}${data?.file}`
    }]
    };

    this.apiService.post(`/hr-station/candidateOffer`, payload).subscribe({
      next: (res: any) => {
        this.tostr.success('Offer Added Successfully');
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error adding progress', error);
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
      const payload = {
        serviceId: this.serviceId,
        stationId:'5',
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
          this.closeDialog();
        },
        error: (error) => {
          this.tostr.error('Error adding progress');
        }
      });
    } else this.tostr.warning('Please Add Feedback');

  }

  approveClick(): void {
    const feedbackElement = document.getElementById('feedback') as HTMLInputElement;
    const feedback = feedbackElement?.value.trim();
    if (feedback) {
      this.feedback = feedback;
      const payload = {
        serviceSeqId: this.serviceId,
        feedBack: this.feedback,
        feedBackBy: this.userId
      };

      this.apiService.post(`/hr-station/candidateToUser`, payload).subscribe({
        next: (res: any) => {
          this.tostr.success('Approval successful');
          this.closeDialog();
        },
        error: (error) => this.tostr.error('Error during approval')
      });
    } else {
      this.tostr.warning('Please Add Feedback');
    }
  }

}
