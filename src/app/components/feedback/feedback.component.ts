import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { ToastrServices } from 'src/app/services/toastr.service';
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  feedback: any;
  stationId: any;
  candidateServiceId: any;
  constructor(public dialogRef: MatDialogRef<FeedbackComponent>, @Inject(MAT_DIALOG_DATA)
  public data: any,
    private apiService: ApiService, private tostr: ToastrServices) { }

  ngOnInit(): void { }

  onSubmitClick(): void {
    const feedbackElement = document.getElementById('feedback') as HTMLInputElement;
    if (feedbackElement) this.feedback = feedbackElement.value;
    this.candidateServiceId = this.data?.serviceId;
    this.stationId = this.data.stationId;
    const payload = {
      serviceId: this.data?.candidateId,
      stationId: this.stationId,
      status: this.data?.status,
      feedBack: this.feedback,
      userId: this.data?.userId
    }
    this.apiService.post(`/screening-station/reject/candidate`, payload).subscribe({
      next: (res: any) => {
        this.tostr.success('Candidate Rejected Successfully');
      },
      error: (error) => {
        this.tostr.error('Something went wrong');
      }
    });
    this.dialogRef.close(true);

  }


  onCancelClick(): void {
    this.dialogRef.close();
  }

}
