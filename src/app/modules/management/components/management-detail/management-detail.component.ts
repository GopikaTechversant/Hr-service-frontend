import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { ToastrServices } from 'src/app/services/toastr.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-management-detail',
  templateUrl: './management-detail.component.html',
  styleUrls: ['./management-detail.component.css']
})
export class ManagementDetailComponent implements OnInit{
  salary: any;
  displayDate: any;
  descriptionValue: any;
  showDescription: boolean = false;
  serviceId: number = 0;
  candidateDetails: any;
  today: Date = new Date();
  hrReview: any;
  feedback: any;
  userId: any;
  resumePath: any;
  templateData: any;
  constructor(public dialogRef: MatDialogRef<ManagementDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  private apiService: ApiService, private datePipe: DatePipe, private tostr: ToastrServices){
    if (data) {
      this.candidateDetails = data?.candidateDetails?.candidate;
      this.hrReview = data?.candidateDetails?.reqHrReview;
      this.serviceId = this.data?.candidateDetails?.serviceId;
      this.feedback = data?.candidateDetails?.reqCandidateComment?.commentComment;      
    }
    this.dialogRef.updateSize('60%', '85%')
  }

  ngOnInit(): void {
    this.today = new Date();
    this.userId = localStorage.getItem('userId');
  }

  dateChange(event: any): void {
    let date = new Date(event?.value);
    this.displayDate = this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  fetchTemplates(): void {
    this.apiService.get(`/candidate/mail/template?msgType=offer&candidateId=695`).subscribe((res: any) => {
      if (res?.data) {
        this.templateData = res?.data;
      }
    })
  }

  viewResume(resume: any) {
    this.resumePath = resume;
    console.log("this.resumePath", this.resumePath);
    window.open(`${environment.s3_url}${this.resumePath}`, '_blank');
    console.log("`${environment.s3_url}${this.resumePath}`",typeof(`${environment.s3_url}${this.resumePath}`));
  }

}
