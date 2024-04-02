import { DatePipe } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { ToastrServices } from 'src/app/services/toastr.service';
@Component({
  selector: 'app-hr-candidate-detail',
  templateUrl: './hr-candidate-detail.component.html',
  styleUrls: ['./hr-candidate-detail.component.css'],
  providers: [DatePipe],
})
export class HrCandidateDetailComponent {
  salary: any;
  displayDate: any;
  descriptionValue: any;
  showDescription: boolean = false;
  serviceId: number = 0;
  candidateDetails: any;
  today: Date = new Date();
  hrReview: any;
  constructor(public dialogRef: MatDialogRef<HrCandidateDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService, private datePipe: DatePipe, private tostr: ToastrServices) {
    if (data) {
      this.candidateDetails = data?.candidateDetails?.candidate;
      this.hrReview = data?.candidateDetails?.reqHrReview;
      this.serviceId = this.data?.candidateDetails?.serviceId;
    }
    this.dialogRef.updateSize('60%', '85%')
  }

  ngOnInit(): void {
    this.today = new Date();
  }

  dateChange(event: any): void {
    let date = new Date(event?.value);
    this.displayDate = this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  addOffer(): void {
    const scoreElement = document.getElementById('salary') as HTMLInputElement;
    this.salary = scoreElement ? scoreElement.value : '';
    const descriptionElement = document.getElementById('description') as HTMLInputElement;
    this.descriptionValue = descriptionElement ? descriptionElement.value : '';
    const payload = {
      offerServiceSeqId: this.serviceId,
      offerSalary: this.salary,
      offerDescription: this.descriptionValue,
      offerJoinDate: this.displayDate
    }
    this.apiService.post(`/hr-station/candidateOffer`, payload).subscribe({
      next: (res: any) => {
        this.tostr.success('Offer Added Successfully');
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error adding progress', error);
      }
    })
  }

  cancelClick(): void {
    this.closeDialog();
  }

  rejectClick(): void {
    const userId = localStorage.getItem('userId');
    let payload = {
      serviceId: this.serviceId,
      stationId: this.candidateDetails?.candidateStation,
      userId: userId,
      status: "rejected",
    }
    this.apiService.post(`/screening-station/reject/candidate`, payload).subscribe({
      next: (res: any) => {
        this.closeDialog();
      },
      error: (error) => {
        this.tostr.error('Error adding progress');
      }
    });
  }

  approveClick(): void {
    const payload = { serviceSeqId: this.serviceId };
    this.apiService.post(`/hr-station/candidateToUser`, payload).subscribe({
      next: (res: any) => {
        this.tostr.success('Approval successful');
        this.closeDialog();
      },
      error: (error) => this.tostr.error('Error during approval')
    });
  }
}
