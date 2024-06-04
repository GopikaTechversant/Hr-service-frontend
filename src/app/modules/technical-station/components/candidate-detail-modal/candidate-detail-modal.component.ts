import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { ToastrServices } from 'src/app/services/toastr.service';
import { environment } from 'src/environments/environments';
import { S3Service } from 'src/app/services/s3.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-candidate-detail-modal',
  templateUrl: './candidate-detail-modal.component.html',
  styleUrls: ['./candidate-detail-modal.component.css']
})
export class CandidateDetailModalComponent implements OnInit {
  private keySubscription?: Subscription;
  uploadedFileKey: string = '';
  candidateDetails: any;
  showRequest: boolean = false;
  progessAdded: boolean = false;
  scoreValue: string = '';
  descriptionValue: string = '';
  skillValue: string = '';
  progressQuery = {
    progressAssignee: "",
    progressSkill: "",
    progressServiceId: 0,
    progressScore: "",
    progressDescription: ""
  }
  serviceId: any = null
  progressAssignee: any = null;
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
  mailTemplateData: any;

  constructor(public dialogRef: MatDialogRef<CandidateDetailModalComponent>, private apiService: ApiService, private tostr: ToastrServices, private s3Service: S3Service,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.candidateDetails = data?.candidateDetails;
      this.stationId = data?.stationId;
      this.serviceId = this.candidateDetails?.serviceId;
      if (data?.progressStatus > 0) this.progessAdded = true;
    }
    this.dialogRef.updateSize('60vw', '90vh');
    this.templateData = { message: '' };
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.file = file;
      this.fileName = file?.name;
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
    });
  }

  addProgress(): void {
    // this.submitForm = true;
    const formData = new FormData();
    const skillElement = document.getElementById('skill') as HTMLInputElement;
    const scoreElement = document.getElementById('score') as HTMLInputElement;
    const descriptionElement = document.getElementById('description') as HTMLInputElement;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;
    if (!this.uploadedFileKey) {
      this.tostr.warning('File upload is in progress, please wait.');
      return;
    }
    const payload = {
      progressAssignee: this.progressAssignee ? this.progressAssignee : this.userId,
      progressSkill: skillElement.value,
      progressServiceId: this.serviceId ? this.serviceId.toString() : '0',
      progressScore: scoreElement.value,
      progressDescription: descriptionElement.value,
      file: this.uploadedFileKey,
    }
    let baseUrl = this.stationId === '3' ? `/technical-station` : this.stationId === '4' ? `/technical-station-two` : '';
    if (baseUrl) {
      this.apiService.post(`${baseUrl}/add-progress/v1`, payload).subscribe({
        next: (res: any) => {
          this.tostr.success('Progress added successfully');
          this.closeDialog();
        },
        error: (error) => {
          this.tostr.warning('Unable to Update Progress');
        }
      });
    } else {
      this.tostr.error('Invalid operation');
    }
  }

  // addProgress(): void {
  //   const formData = new FormData();
  //   const skillElement = document.getElementById('skill') as HTMLInputElement;
  //   const scoreElement = document.getElementById('score') as HTMLInputElement;
  //   const descriptionElement = document.getElementById('description') as HTMLInputElement;
  //   const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  //   const file = fileInput.files ? fileInput.files[0] : null;

  //   if (skillElement && skillElement.value) formData.append('progressSkill', skillElement.value);
  //   if (scoreElement && scoreElement.value) formData.append('progressScore', scoreElement.value);
  //   if (descriptionElement && descriptionElement.value) formData.append('progressDescription', descriptionElement.value);
  //   if (file) formData.append('file', file, file.name);

  //   formData.append('progressAssignee', this.progressAssignee ? this.progressAssignee : this.userId);
  //   formData.append('progressServiceId', this.serviceId ? this.serviceId.toString() : '0');

  //   let baseUrl = this.stationId === '3' ? `/technical-station` : this.stationId === '4' ? `/technical-station-two` : '';
  //   if (baseUrl) {
  //     this.apiService.post(`${baseUrl}/add-progress`, formData).subscribe({
  //       next: (res: any) => {
  //         this.tostr.success('Progress added successfully');
  //         this.closeDialog();
  //       },
  //       error: (error) => {
  //         this.tostr.warning('Unable to Update Progress');
  //       }
  //     });
  //   } else {
  //     this.tostr.error('Invalid operation');
  //   }
  // }

  showMail(item: 'approve' | 'rejection'): void {
    this.showSelection = item === 'approve';
    this.showRejection = item !== 'approve';
    this.messageType = item;
    this.mailTemplateData = {
      firstName: this.candidateDetails['candidate.candidateFirstName'],
      lastName: this.candidateDetails['candidate.candidateLastName'],
      id: this.candidateDetails['candidate.candidateId'],
      messageType: item
    };
  }

  onSubmitData(event: any): void {
    if (event?.clickType === 'cancel') this.cancelClick();
    if (event?.messageType === 'approve') this.approveClick(event);
    if (event?.messageType === 'rejection') this.rejectClick(event);
  }

  cancelClick(): void {
    this.closeDialog();
  }

  approveClick(data: any): void {
    const baseUrl = this.stationId === '3' ? '/technical-station' : this.stationId === '4' ? '/technical-station-two' : '';
    if (baseUrl) {
      const payload = {
        serviceSeqId: this.serviceId,
        feedBack: this.feedback,
        feedBackBy: this.userId,
        feedBackCc: data?.mailCc,
        feedBackMailTemp: data?.mailTemp || '',
        feedBackSubject: data?.mailSubject,
        feedBcc: data?.mailBcc,
      };
      this.apiService.post(`${baseUrl}/approve`, payload).subscribe({
        next: () => {
          this.tostr.success('Approval successful');
          this.closeDialog();
        },
        error: () => this.tostr.error('Error during approval')
      });
    } else {
      this.tostr.error('Invalid operation');
    }
  }


  rejectClick(data: any): void {
    const payload = {
      serviceId: this.serviceId,
      stationId: this.stationId,
      userId: this.userId,
      status: "rejected",
      rejectCc: data?.mailCc,
      rejectMailTemp: data?.mailTemp,
      rejectSubject: data?.mailSubject,
      rejectBcc: data?.mailBcc,
    };

    this.apiService.post(`/screening-station/reject/candidate`, payload).subscribe({
      next: (res: any) => {
        this.closeDialog();
      },
      error: (error) => {
        this.tostr.error('Error adding progress');
      }
    });
  }

  viewResume(resume: any) {
    this.resumePath = resume;
    console.log("this.resumePath", this.resumePath);
    window.open(`${environment.s3_url}${this.resumePath}`, '_blank');
    console.log("`${environment.s3_url}${this.resumePath}`", typeof (`${environment.s3_url}${this.resumePath}`));
  }


  ngOnDestroy(): void {
    if (this.keySubscription) {
      this.keySubscription.unsubscribe();
    }
  }

}
