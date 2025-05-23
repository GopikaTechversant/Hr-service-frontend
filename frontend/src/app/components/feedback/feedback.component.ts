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
  rejectStatus: string = '';
  rejectionRequsitionId: any;
  comment: any;

  constructor(public dialogRef: MatDialogRef<FeedbackComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService, private tostr: ToastrServices) {
    this.candidateDetails = data?.candidateDetails;
    this.rejectStatus = data?.rejectStatus;
    this.rejectionRequsitionId = data?.rejectionRequsitionId;
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
    let inputs = document.querySelectorAll("#comment");
    inputs.forEach((input:any) => {
      this.comment = input.value;
    });
    if (this.filteredStatus && this.comment) {
      this.loader = true;
      const payload = {
        serviceId: this.candidateDetails?.serviceId,
        stationId: this.stationId,
        userId: this.userId,
        status: this.filteredStatus ? this.filteredStatus : "rejected",
        feedBack: this.comment || '',
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
    } else {
      if (!this.filteredStatus) this.tostr.warning('Please Select Reason for Rejection');
      if (!this.comment) this.tostr.warning('Please Add Rejection Feedback');
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  rejectRequisition(): void {
    let inputs = document.querySelectorAll("#comment");
    inputs.forEach((input:any) => {
      this.comment = input.value;
    });
    // this.comment = (document.getElementById('comment') as HTMLInputElement)?.value || '';
    if (this.comment) {
      this.loader = true;
      const payload = {
        requestionId: this.rejectionRequsitionId,
        approve: false,
        reason: this.comment
      }
      this.apiService.post(`/service-request/activateRequest`, payload).subscribe({
        next: (res: any) => {
          this.loader = false;
          this.tostr.success('Rejected');
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.tostr.error('Unable to Reject');
        }
      })
    } else this.tostr.warning('Please add Feedback');
  }

}