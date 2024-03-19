import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
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
  constructor(public dialogRef: MatDialogRef<FeedbackComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient,
    private router: Router, private route: ActivatedRoute,) {

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
      serviceId: this.candidateServiceId,
      stationId: this.stationId,
      status: this.data?.status,
      feedBack: this.feedback,
      userId: this.data?.candidateId
    }
    if (this.data?.status === 'selected') {
      this.router.navigate(['dashboard/interview-details'], {
        state: { candidate: this.data?.candidateDetails }
      });
    }
 

    this.http.post(`${environment.api_url}/screening-station/reject/candidate`, payload).subscribe((res: any) => {
      // if(res?.message === 'Candidate Selected' || res?.message === 'Candidate Already selected'){
      //   this.router.navigate(['dashboard/interview-details'], {
      //     state: { candidate : this.data?.candidateDetails}     
      //   });
      // } 
      if (this.data?.status === 'Candidate Selected') {
        this.router.navigate(['dashboard/interview-details'], {
          state: { candidate: this.data?.candidateDetails }
        });
        this.selectedCandidatesEmitter.emit([this.candidateServiceId]);
      }
    })
  }

  onCancelClick(): void {
    this.dialogRef.close(false);
  }

}
