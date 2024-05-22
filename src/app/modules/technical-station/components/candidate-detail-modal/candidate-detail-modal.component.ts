import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { ToastrServices } from 'src/app/services/toastr.service';
import { environment } from 'src/environments/environments';
import { S3Service } from 'src/app/services/s3.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-candidate-detail-modal',
  templateUrl: './candidate-detail-modal.component.html',
  styleUrls: ['./candidate-detail-modal.component.css']
})
export class CandidateDetailModalComponent implements OnInit {
  @ViewChild('template', { static: false }) templateRef!: ElementRef;
  private keySubscription?: Subscription;
  uploadedFileKey: string = '';
  candidateDetails: any;
  showRequest: boolean = false;
  progessAdded: boolean = false;
  scoreValue: string = '';
  descriptionValue: string = '';
  skillValue: string = '';
  progressQuery = {
    progressAssignee: "",
    progressSkill: "",
    progressServiceId: 0,
    progressScore: "",
    progressDescription: ""
  }
  serviceId: any = null
  progressAssignee: any = null;
  stationId: any;
  feedback: any;
  userId: any;
  resumePath: any;
  file: File | null = null;
  fileName: any;
  messageType: string = '';
  showSelection: boolean = false;
  showRejection: boolean = false;
  isEditable:boolean = false;
  today: Date = new Date();
  templateData: any;
  feedbackCc: string = '';
  htmlString: string = '';
  feedbackSubject: string = '';
  content: any;

  constructor(public dialogRef: MatDialogRef<CandidateDetailModalComponent>, private apiService: ApiService, private tostr: ToastrServices, private s3Service: S3Service,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.candidateDetails = data?.candidateDetails;
      this.stationId = data?.stationId;
      this.serviceId = this.candidateDetails?.serviceId;
      if (data?.progressStatus > 0) this.progessAdded = true;
    }
    this.dialogRef.updateSize('60vw', '90vh');
    this.templateData = { message: '' }; 
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.file = file;
      this.fileName = file?.name;
      if (this.fileName) this.s3Service.uploadImage(this.file, 'hr-service-images', this.file);
      this.getKeyFroms3();
    }
  }

  getKeyFroms3(): void {
    this.keySubscription = this.s3Service.key.subscribe((key: string) => {
      this.uploadedFileKey = key;
    });
  }

  addProgress(): void {
    // this.submitForm = true;
    const formData = new FormData();
    const skillElement = document.getElementById('skill') as HTMLInputElement;
    const scoreElement = document.getElementById('score') as HTMLInputElement;
    const descriptionElement = document.getElementById('description') as HTMLInputElement;
    // const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    // const file = fileInput.files ? fileInput.files[0] : null;
    if (!this.uploadedFileKey) {
      this.tostr.warning('File upload is in progress, please wait.');
      return;
    }
    const payload = {
      progressAssignee: this.progressAssignee ? this.progressAssignee : this.userId,
      progressSkill: skillElement.value,
      progressServiceId: this.serviceId ? this.serviceId.toString() : '0',
      progressScore: scoreElement.value,
      progressDescription: descriptionElement.value,
      file: this.uploadedFileKey,
    }
    let baseUrl = this.stationId === '3' ? `/technical-station` : this.stationId === '4' ? `/technical-station-two` : '';
    if (baseUrl) {
      this.apiService.post(`${baseUrl}/add-progress/v1`, payload).subscribe({
        next: (res: any) => {
          this.tostr.success('Progress added successfully');
          this.closeDialog();
        },
        error: (error) => {
          this.tostr.warning('Unable to Update Progress');
        }
      });
    } else {
      this.tostr.error('Invalid operation');
    }
  }

  showMail(item: any): void {
    if (item === 'approve') {
      this.showSelection = true;
      this.showRejection = false;
    } else {
      this.showRejection = true;
      this.showSelection = false;
    }
    this.messageType = item;
    this.fetchTemplates();
  }

  fetchTemplates(): void {
    this.apiService.get(`/candidate/mail/template?msgType=${this.messageType}&candidateId=${this.candidateDetails['candidate.candidateId']}`).subscribe((res: any) => {
      if (res?.data) {
        this.templateData = res?.data;
      }
    })
  }

  updateHtmlContent(event: any): void {
    this.content = event?.target?.value ?? ''; // Get the value from the event, or an empty string if it's undefined
    this.templateData.message = this.content;
    console.log('Updated content:', this.templateData.message);

    const templateElement = this.templateRef.nativeElement;
   

    this.htmlString = templateElement.innerHTML; // Update the htmlString with the modified template content
}




  submitClick(): void {
    const feedback = document.getElementById('feedback') as HTMLInputElement;
    if (feedback) this.feedback = feedback?.value;
    const feedbackCc = document.getElementById('cc') as HTMLInputElement;
    if (feedbackCc) this.feedbackCc = feedbackCc?.value;
    const feedbackSubject = document.getElementById('subject') as HTMLInputElement;
    if(feedbackSubject) this.feedbackSubject = feedbackSubject.value;
    if (this.templateRef) {
      const templateElement = this.templateRef.nativeElement;
      const textarea = templateElement.querySelector('textarea'); 
      if (textarea) {
          const div = document.createElement('div'); 
          div.className = 'editable p-t-10 p-b-10';
          div.style.width = '100%'; 
          div.style.outline = 'none'; // Remove outline
          div.style.border = 'none'; // Remove border
          div.style.minHeight = '200px'; // Set the min height
          div.innerText = this.content; // Set the text content of the div to the textarea value
          textarea.replaceWith(div); // Replace the textarea with the div
      }
      this.htmlString = templateElement.outerHTML;
      this.htmlString = this.templateRef.nativeElement.innerHTML.replace(textarea, '<div>'); // Remove the textarea from the htmlString

    }
        const payload = {
          // serviceSeqId: this.serviceId,
          // feedBack: this.feedback,
          // feedBackBy: this.userId,
          mailId: 'alfiya.sr@techversantinfotech.com',
          cc: this.feedbackCc,
          message : this.htmlString,
          subject : this.feedbackSubject,
        };
        this.apiService.post(`/candidate/send-mail`, payload).subscribe({
          next: (res: any) => {
            this.tostr.success('Approval successful');
            this.closeDialog();
          },
          error: (error) => this.tostr.error('Error during approval')
        });
      
    // }
    // else this.tostr.error('Invalid operation');
    // if(this.isEditable) this.tostr.warning('Please Save Changes in Mail');
    // const confirmationCheckbox = document.getElementById('confirmDetails') as HTMLInputElement;
    // if (confirmationCheckbox && confirmationCheckbox?.checked && (this.messageType.trim() !== '')) {
    //   if(this.messageType.trim() === 'approve') this.approveClick();
    //   if(this.messageType.trim() === 'rejection') this.rejectClick();
    // } else {
    //   this.tostr.warning('Please confirm all details before submitting');
    // }
  }

  cancelClick(): void {
    this.closeDialog();
  }

  rejectClick(): void {
    const feedback = document.getElementById('feedback') as HTMLInputElement;
    if (feedback) this.feedback = feedback?.value;
    if (this.feedback.trim() !== '') {
      let payload = {
        serviceId: this.serviceId,
        stationId: this.stationId,
        userId: this.userId,
        status: "rejected",
        feedBack: this.feedback,
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


  viewResume(resume: any) {
    this.resumePath = resume;
    console.log("this.resumePath", this.resumePath);
    window.open(`${environment.s3_url}${this.resumePath}`, '_blank');
    console.log("`${environment.s3_url}${this.resumePath}`", typeof (`${environment.s3_url}${this.resumePath}`));
  }

  approveClick(): void {
    const feedback = document.getElementById('feedback') as HTMLInputElement;
    if (feedback) this.feedback = feedback?.value;
    const feedbackCc = document.getElementById('cc') as HTMLInputElement;
    if (feedbackCc) this.feedbackCc = feedbackCc?.value;
    const feedbackSubject = document.getElementById('subject') as HTMLInputElement;
    if(feedbackSubject) this.feedbackSubject = feedbackSubject.value;
    if (this.templateRef) {
      const templateElement = this.templateRef.nativeElement;
      this.htmlString = templateElement.outerHTML;
    }
  
    let baseUrl = '';
    if (this.stationId === '3') baseUrl = `/technical-station`;
    if (this.stationId === '4') baseUrl = `/technical-station-two`;
    if (baseUrl) {
      if (this.feedback.trim() !== '') {
        const payload = {
          serviceSeqId: this.serviceId,
          feedBack: this.feedback,
          feedBackBy: this.userId,
          feedBackCc: this.feedbackCc,
          feedBackMailTemp : this.htmlString,
          feedBackSubject : this.feedbackSubject,
        };
        this.apiService.post(`${baseUrl}/approve`, payload).subscribe({
          next: (res: any) => {
            this.tostr.success('Approval successful');
            this.closeDialog();
          },
          error: (error) => this.tostr.error('Error during approval')
        });
      } else this.tostr.warning('Please Add Feedback');
    }
    else this.tostr.error('Invalid operation');
  }

  ngOnDestroy(): void {
    if (this.keySubscription) {
      this.keySubscription.unsubscribe();
    }
  }
}
