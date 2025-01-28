import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { ToastrServices } from 'src/app/services/toastr.service';
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
})
export class FeedbackComponent implements OnInit {
  rejectionFeedbackList: any;
  openRejectionFeedback: boolean = false;
  selectedRejectionFeedback: string = '';
  filteredStatus: string = '';
  filterStatus: boolean = false;
  stationId: any;
  userId: any;
  status: any;
  candidateDetails: any;
  loader: boolean = false;
  rejectStatus:string = '';
  constructor(public dialogRef: MatDialogRef<FeedbackComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService, private tostr: ToastrServices) {
    this.candidateDetails = data?.candidateDetails;
    this.rejectStatus = data?.rejectStatus;
    console.log(" this.rejectStatus", this.rejectStatus);
    
  }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.filterStatus = false;
      this.openRejectionFeedback = false;
    }
  }

  ngOnInit(): void {
    this.stationId = localStorage.getItem('currentStationId');
    this.userId = localStorage.getItem('userId');
    this.fetchFeedbackList();
    this.fetchStatus();
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
  closeDialog(): void {
    this.dialogRef.close();
  }

  selectStatusFilter(status: string) {
    this.filteredStatus = status;
  }

  selectRejectionFeedback(status: string) {
    this.selectedRejectionFeedback = status;
  }

  rejectClick(): void {
    if (this.filteredStatus && this.selectedRejectionFeedback) {
    this.loader = true;
      const payload = {
        serviceId: this.candidateDetails?.serviceId,
        stationId: this.stationId,
        userId: this.userId,
        status: this.filteredStatus ? this.filteredStatus : "rejected",
        feedBack: this.selectedRejectionFeedback || '',
      };
      this.apiService.post(`/screening-station/reject/candidate`, payload).subscribe({
        next: (res: any) => {
          this.loader = false;
          this.closeDialog();
        },
        error: (error) => {
          this.loader = false;
          this.tostr.error('Error adding progress');
          this.closeDialog();
        }
      });
    }else{
     if(!this.filteredStatus) this.tostr.warning('Please Select Reason for Rejection');
     if(!this.selectedRejectionFeedback) this.tostr.warning('Please Add Rejection Feedback');
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  rejectRequisition():void{
    // this.loader = true;
    this.dialogRef.close();
    this.tostr.success('Rejected');
  }

}
