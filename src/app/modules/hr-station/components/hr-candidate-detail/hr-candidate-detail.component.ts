import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { ToastrServices } from 'src/app/services/toastr.service';
import { environment } from 'src/environments/environments';
@Component({
  selector: 'app-hr-candidate-detail',
  templateUrl: './hr-candidate-detail.component.html',
  styleUrls: ['./hr-candidate-detail.component.css'],
  providers: [DatePipe],
})
export class HrCandidateDetailComponent {
  @ViewChild('template', { static: false }) templateRef!: ElementRef;
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
  showSelection: boolean = false;
  showRejection: boolean = false;
  messageType: string = '';
  isEditable: boolean = false;
  file: File | null = null;
  fileName: string = '';
  content: any;
  htmlString: any;
  mailTemplateData: any;
  constructor(public dialogRef: MatDialogRef<HrCandidateDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService, private datePipe: DatePipe, private tostr: ToastrServices) {
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

  showMail(item: any): void {
    if (item === 'offer') {
      this.showSelection = true;
      this.showRejection = false;
    } else {
      this.showRejection = true;
      this.showSelection = false;
    }
    this.messageType = item;
    this.mailTemplateData = {
      name: `${this.candidateDetails?.candidateFirstName + ' ' + this.candidateDetails?.candidateLastName}`,
      id: this.candidateDetails?.candidateId,
      messageType: item
    };
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.file = file;
      this.fileName = file?.name;
    }
  }

  onSubmitData(event:any):void {
    console.log(event);
    
  }


  addOffer(): void {
    const scoreElement = document.getElementById('salary') as HTMLInputElement;
    this.salary = scoreElement ? scoreElement.value : '';
    const payload = {
      offerServiceSeqId: this.serviceId,
      offerSalary: this.salary,
      // offerDescription: descriptionTemplate,
      offerJoinDate: this.displayDate
    };
    this.apiService.post(`/hr-station/candidateOffer`, payload).subscribe({
      next: (res: any) => {
        this.tostr.success('Offer Added Successfully');
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error adding progress', error);
      }
    });
  }

  cancelClick(): void {
    this.closeDialog();
  }

  viewResume(resume: any) {
    this.resumePath = resume;
    console.log("this.resumePath", this.resumePath);
    window.open(`${environment.s3_url}${this.resumePath}`, '_blank');
    console.log("`${environment.s3_url}${this.resumePath}`", typeof (`${environment.s3_url}${this.resumePath}`));
  }

  rejectClick(): void {
    const feedback = document.getElementById('feedback') as HTMLInputElement;
    if (feedback) this.feedback = feedback?.value;
    if (this.feedback.trim() !== '' || this.messageType.trim() === 'rejection') {
      let payload = {
        serviceId: this.serviceId,
        stationId: this.candidateDetails?.candidateStation,
        userId: this.userId,
        status: "rejected",
        // rejectCc: this.feedbackCc,
        // rejectMailTemp: this.htmlString,
        // rejectSubject: this.feedbackSubject
      }
      this.apiService.post(`/screening-station/reject/candidate`, payload).subscribe({
        next: (res: any) => {
          this.closeDialog();
        },
        error: (error) => {
          this.tostr.error('Error adding progress');
        }
      });
    } else this.tostr.warning('Please Add Feedback');
  }

  approveClick(): void {
    const feedback = document.getElementById('feedback') as HTMLInputElement;
    if (feedback) this.feedback = feedback?.value;
    if (this.feedback.trim() !== '') {
      const payload = {
        serviceSeqId: this.serviceId,
        feedBack: this.feedback,
        feedBackBy: this.userId
      };
      this.apiService.post(`/hr-station/candidateToUser`, payload).subscribe({
        next: (res: any) => {
          this.tostr.success('Approval successful');
          this.closeDialog();
        },
        error: (error) => this.tostr.error('Error during approval')
      });
    } else this.tostr.warning('Please Add Feedback');
  }
}
