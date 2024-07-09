import { HttpClient } from '@angular/common/http';
import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environments';
import { ApiService } from 'src/app/services/api.service';
import { ToastrServices } from 'src/app/services/toastr.service';
import { S3Service } from 'src/app/services/s3.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent {
  @Output() scoreSubmitted = new EventEmitter<number>();
  @Output() serviceIdPassed = new EventEmitter<number>();
  @Output() resultData = new EventEmitter<{ score: number, serviceId: number }>();
  examServiceId;
  scoreValue: string = '';
  descriptionValue: string = '';
  fileInputClicked: boolean = false;
  selectedFile: any;
  resumeUploadSuccess: boolean = false;
  submitForm: boolean = false;
  private keySubscription?: Subscription;
  uploadedFileKey: string = '';
  loader: boolean = false;
  serviceId: any;
  userId: any;
  constructor(private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService, private tostr: ToastrServices, private s3Service: S3Service,
    private dialogRef: MatDialogRef<ResultComponent>) {
    if (data) {
      this.examServiceId = data.candidateIds
      this.serviceId = data.candidate?.serviceSequence.serviceId
    }
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');

  }

  onFileSelected(event: any) {
    this.fileInputClicked = true;
    this.selectedFile = event.target.files[0];
    if (event.target.files.length > 0) this.resumeUploadSuccess = true;
    if (this.selectedFile) {
      this.loader = true;
      this.s3Service.uploadImage(this.selectedFile, 'hr-service-images', this.selectedFile);
      this.getKeyFroms3();
    }
  }

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

  // submitClick(): void {
  //   const scoreElement = document.getElementById('score') as HTMLInputElement;
  //   if (scoreElement) this.scoreValue = scoreElement.value;
  //   const descriptionElement = document.getElementById('description') as HTMLInputElement;
  //   if (descriptionElement) this.descriptionValue = descriptionElement.value;
  //   const formdata = new FormData;
  //   formdata.append('examScore',this.scoreValue);
  //   formdata.append('examServiceId',this.examServiceId);
  //   formdata.append('examDescription',this.descriptionValue);
  //   if(this.selectedFile) formdata.append('file',this.selectedFile);

  //   let payload = {
  //     examScore: this.scoreValue,
  //     examServiceId: this.examServiceId,
  //     examDescription: this.descriptionValue
  //   }

  //   this.apiService.post(`/written-station/result`, formdata).subscribe((res: any) => {
  //     this.dialogRef.close(true);
  //     this.scoreSubmitted.emit(parseInt(this.scoreValue, 10));
  //   }, err => {
  //     this.dialogRef.close();
  //     if (err?.status === 500) this.tostr.error("Internal Server Error")
  //     else this.tostr.warning(err?.error?.message ? err?.error?.message : "Cannot update Result")
  //   });

  // }
  submitClick(): void {
    const scoreElement = document.getElementById('score') as HTMLInputElement;
    if (scoreElement) this.scoreValue = scoreElement.value;
    const descriptionElement = document.getElementById('description') as HTMLInputElement;
    if (descriptionElement) this.descriptionValue = descriptionElement.value;
    if (!this.uploadedFileKey) {
      this.tostr.warning('File upload is in progress, please wait.');
      return;
    }
    let payload = {
      examScore: this.scoreValue,
      examServiceId: this.examServiceId,
      examDescription: this.descriptionValue,
      file: this.uploadedFileKey,
      userId: this.userId
    }
    if (this.scoreValue && this.examServiceId && this.descriptionValue && this.uploadedFileKey) {
      this.apiService.post(`/written-station/result`, payload).subscribe({
        next: (res: any) => {
          this.dialogRef.close(true);
          this.resultData.emit({ score: parseInt(this.scoreValue, 10), serviceId: this.examServiceId });
          this.tostr.success('Result added successfully');
        },
        error: (err) => {
          this.dialogRef.close();
          if (err?.status === 500) {
            this.tostr.error("Internal Server Error");
          } else {
            this.tostr.warning(err?.error?.message ? err?.error?.message : "Cannot update Result");
          }
        }
      });
    } else this.tostr.warning('Please fill all the fields before submit')
  }

  cancelClick(): void {
    this.dialogRef.close(false);
  }

  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
    fileInput.click();
  }

  ngOnDestroy(): void {
    if (this.keySubscription) {
      this.keySubscription.unsubscribe();
    }
  }

}


