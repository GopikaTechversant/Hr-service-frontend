import { DatePipe } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-hr-candidate-detail',
  templateUrl: './hr-candidate-detail.component.html',
  styleUrls: ['./hr-candidate-detail.component.css'],
  providers: [DatePipe],
})
export class HrCandidateDetailComponent {
  showRequest: boolean = false;
  showcandidates: boolean = false;
  showProgress: boolean = true;
  candidateId: any;
  salary: any;
  displayDate: any;
  descriptionValue: any;
  showWarning: boolean = false;
  showDescription: boolean = false;
  showbtn: boolean = true;
  serviceId: any;
  candidateDetails: any;
  progessAdded: any;
  today: Date = new Date ();
  constructor(public dialogRef: MatDialogRef<HrCandidateDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService, private datePipe: DatePipe) {
    if (data) {
      this.candidateDetails = data?.candidateDetails;
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
    this.serviceId = this.candidateDetails?.serviceId;
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
        this.showbtn = false;
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

  submitClick(): void { }

}