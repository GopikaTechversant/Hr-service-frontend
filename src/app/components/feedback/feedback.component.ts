import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  @Output() rejectedCandidatesEmitter: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() selectedCandidatesEmitter: EventEmitter<any[]> = new EventEmitter<any[]>();
  feedback: any;
  stationId: any;
  rejectedcandidates: any[] = [];
  candidateServiceId: any;
  constructor(public dialogRef: MatDialogRef<FeedbackComponent>, @Inject(MAT_DIALOG_DATA) 
  public data: any,
  private apiService : ApiService) {

  }

  ngOnInit(): void {
   
  }

  onSubmitClick(): void {
    this.dialogRef.close(true);
    this.apiCall();
  }

  apiCall(): void {
    const feedback = document.getElementById('feedback') as HTMLInputElement;
    if (feedback) this.feedback = feedback.value;
    this.candidateServiceId = this.data?.serviceId;
    this.rejectedCandidatesEmitter.emit([this.candidateServiceId]);
    this.stationId = this.data.stationId;
    const payload = {
      serviceId: this.data?.candidateId,
      stationId: this.stationId,
      status: this.data?.status,
      feedBack: this.feedback,
      userId: this.data?.userId
    }
    this.apiService.post(`/screening-station/reject/candidate`, payload).subscribe((res: any) => {
      if (this.data?.status === 'pending') this.selectedCandidatesEmitter.emit([this.candidateServiceId]);
    })
  }

  onCancelClick(): void {
    this.dialogRef.close(false);
  }

}
