import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  constructor(public dialogRef: MatDialogRef<FeedbackComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient) {

  }
  ngOnInit(): void {

  }
  onSubmitClick(): void {
    const feedback = document.getElementById('feedback') as HTMLInputElement;
    if (feedback) this.feedback = feedback.value;
    this.candidateServiceId = this.data.candidateId;
    this.rejectedCandidatesEmitter.emit([this.candidateServiceId]);
    this.stationId = this.data.stationId;
    const payload = {
      serviceId: this.candidateServiceId,
      stationId: this.stationId,
      status: this.data.status == 'pending' ? 'selected' : 'rejected',
      feedBack: this.feedback
    }

    this.http.post(`${environment.api_url}/screening-station/reject/candidate`, payload).subscribe((res: any) => {
      // this.dialogRef.close(true);
      if (this.data.status === 'pending') {
        console.log(this.candidateServiceId);
        this.selectedCandidatesEmitter.emit([this.candidateServiceId]);
      }
      this.dialogRef.close(true);
    })
    
  }
  onCancelClick(): void {
    this.dialogRef.close(false);
  }
}
