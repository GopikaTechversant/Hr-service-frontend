import { Component, Inject, OnInit } from '@angular/core';
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
  submitForm: boolean = false;
  constructor(public dialogRef: MatDialogRef<CandidateDetailModalComponent>, private apiService: ApiService, private tostr: ToastrServices, private s3Service: S3Service,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.candidateDetails = data?.candidateDetails;
      this.stationId = data?.stationId;
      this.serviceId = this.candidateDetails?.serviceId;
      if (data?.progressStatus > 0) this.progessAdded = true;
    }
    this.dialogRef.updateSize('60vw', '90vh');
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
  getKeyFroms3(): void {
    this.keySubscription = this.s3Service.key.subscribe((key: string) => {
      this.uploadedFileKey = key;
    });
  }

  addProgress(): void {
    this.submitForm = true;
    const formData = new FormData();
    const skillElement = document.getElementById('skill') as HTMLInputElement;
    const scoreElement = document.getElementById('score') as HTMLInputElement;
    const descriptionElement = document.getElementById('description') as HTMLInputElement;
    // const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    // const file = fileInput.files ? fileInput.files[0] : null;
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

  rejectClick(): void {
    const feedback = document.getElementById('feedback') as HTMLInputElement;
    if (feedback) this.feedback = feedback?.value;
    if (this.feedback.trim() !== '') {
      let payload = {
        serviceId: this.serviceId,
        stationId: this.stationId,
        userId: this.userId,
        status: "rejected",
        feedBack: this.feedback,
      }
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


  viewResume(resume: any) {
    this.resumePath = resume;
    console.log("this.resumePath", this.resumePath);
    window.open(`${environment.s3_url}${this.resumePath}`, '_blank');
    console.log("`${environment.s3_url}${this.resumePath}`", typeof (`${environment.s3_url}${this.resumePath}`));
  }

  approveClick(): void {
    const feedback = document.getElementById('feedback') as HTMLInputElement;
    if (feedback) this.feedback = feedback?.value;
    let baseUrl = '';
    if (this.stationId === '3') baseUrl = `/technical-station`;
    if (this.stationId === '4') baseUrl = `/technical-station-two`;
    if (baseUrl) {
      if (this.feedback.trim() !== '') {
        const payload = {
          serviceSeqId: this.serviceId,
          feedBack: this.feedback,
          feedBackBy: this.userId
        };
        this.apiService.post(`${baseUrl}/approve`, payload).subscribe({
          next: (res: any) => {
            this.tostr.success('Approval successful');
            this.closeDialog();
          },
          error: (error) => this.tostr.error('Error during approval')
        });
      } else this.tostr.warning('Please Add Feedback');
    }
    else this.tostr.error('Invalid operation');
  }

  ngOnDestroy(): void {
    if (this.keySubscription) {
      this.keySubscription.unsubscribe();
    }
  }
}
