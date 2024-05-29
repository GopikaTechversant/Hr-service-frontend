import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { S3Service } from 'src/app/services/s3.service';

@Component({
  selector: 'app-mail-template',
  templateUrl: './mail-template.component.html',
  styleUrls: ['./mail-template.component.css']
})
export class MailTemplateComponent implements OnInit {
  @Input() candidate: any;
  @Output() submitData: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('template', { static: false }) templateRef!: ElementRef;

  isEditable: boolean = false;
  messageType: any;
  templateData: any = {};
  content: any;
  htmlString: any;
  candidateId: any;
  feedback: any;
  feedbackCc: any;
  feedbackSubject: any;
  displayDate: any;
  feedbackBcc: any;
  fileName: any;
  selectedFile: any;
  resumeUploadSuccess: boolean = false;
  fileInputClicked: boolean = false;
  uploadedFileKey: string = '';
  today: Date = new Date();
  messageSaved: boolean = false;
  private keySubscription?: Subscription;

  constructor(private apiService: ApiService, private tostr: ToastrService, private datePipe: DatePipe, private s3Service: S3Service) { }
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.candidate?.messageType) {
      this.fetchTemplates();
    }
  }

  fetchTemplates(): void {
    this.apiService.get(`/candidate/mail/template?msgType=${this.candidate?.messageType}&candidateId=${this.candidate?.id}`).subscribe((res: any) => {
      if (res?.data) {
        this.templateData = res?.data;
      }
    })
  }

  onFileSelected(event: any) {
    this.fileInputClicked = true;
    this.selectedFile = event.target.files[0];
    console.log("this.selectedFile in add ", this.selectedFile);
    if (event.target.files.length > 0) this.resumeUploadSuccess = true;
    if (this.selectedFile) this.s3Service.uploadImage(this.selectedFile, 'hr-service-images', this.selectedFile);
    console.log("this.selectedFile", typeof (this.selectedFile));
    this.getKeyFroms3();
    // if(this.selectedFile) this.s3Service.uploadedFile.emit(this.selectedFile)
  }

  getKeyFroms3(): void {
    this.keySubscription = this.s3Service.key.subscribe((key: string) => {
      console.log("Uploaded file key:", key);
      this.uploadedFileKey = key;
    });
  }

  dateChange(event: any): void {
    let date = new Date(event?.value);
    this.displayDate = this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  editClick() {
    this.isEditable = true;
  }

  saveClick(message: any) {
    this.updateHtmlContent(message);
    this.isEditable = false;
    this.messageSaved = true;
  }

  updateHtmlContent(event: any): void {
    this.content = event?.target?.value ?? '';
    this.templateData.message = this.content;
    const templateElement = this.templateRef.nativeElement;
    this.htmlString = templateElement.innerHTML;
  }

  submitClick(): void {
    if (this.messageSaved) {
      const feedback = document.getElementById('feedback') as HTMLInputElement;
      if (feedback) this.feedback = feedback?.value;
      const feedbackCc = document.getElementById('cc') as HTMLInputElement;
      if (feedbackCc) this.feedbackCc = feedbackCc?.value;
      const feedbackBcc = document.getElementById('bcc') as HTMLInputElement;
      if (feedbackBcc) this.feedbackBcc = feedbackCc?.value;
      const feedbackSubject = document.getElementById('subject') as HTMLInputElement;
      if (feedbackSubject) this.feedbackSubject = feedbackSubject.value;
      if (this.isEditable) this.tostr.warning('Please Save Changes in Mail');
      const confirmationCheckbox = document.getElementById('confirmDetails') as HTMLInputElement;
      if (confirmationCheckbox && confirmationCheckbox?.checked && (this.messageType.trim() !== '')) {
        if (this.templateRef) {
          const templateElement = this.templateRef?.nativeElement;
          const textarea = templateElement.querySelector('textarea');
          if (textarea) {
            const div = document.createElement('div');
            div.className = 'editable p-t-10 p-b-10';
            div.style.width = '100%';
            div.style.outline = 'none';
            div.style.border = 'none';
            div.style.minHeight = '200px';
            div.innerText = this.content;
            textarea.replaceWith(div);
          }
          this.htmlString = templateElement.outerHTML;
          this.htmlString = this.templateRef?.nativeElement?.innerHTML.replace(textarea, '<div>');
          if (this.htmlString !== undefined) {
            this.submitClickTest();
            const data = {
              feedback: this.feedback,
              feedbackCc: this.feedbackCc,
              feedbackBcc: this.feedbackBcc,
              feedbackSubject: this.feedbackSubject
            };
            this.submitData.emit(data);
          }
          // if (this.messageType.trim() === 'aprove') this.approveClick();
          // if (this.messageType.trim() === 'rejection') this.rejectClick();
        }

      } else {
        this.tostr.warning('Please confirm all details before submitting');
      }
    } else {
      if (this.isEditable) this.tostr.warning('Please Save Template before submitting');
      else this.tostr.warning('Please Edit and Save Mail before submitting');
    }
  }

  submitClickTest() {
    const payload = {
      // serviceSeqId: this.serviceId,
      // feedBack: this.feedback,
      // feedBackBy: this.userId,
      mailId: 'alfiya.sr@techversantinfotech.com',
      cc: this.feedbackCc,
      message: this.htmlString,
      subject: this.feedbackSubject,
    };
    this.apiService.post(`/candidate/send-mail`, payload).subscribe({
      next: (res: any) => {
        this.tostr.success('Approval successful');
        // this.closeDialog();
      },
      error: (error) => this.tostr.error('Error during approval')
    });

  }

  cancelClick() { }

}
