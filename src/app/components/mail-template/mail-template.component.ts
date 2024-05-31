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
  templateData: any = {};
  content: any;
  htmlString: any;
  candidateId: any;
  feedback: any;
  mailCc: any;
  mailSubject: any;
  displayDate: any;
  mailBcc: any;
  fileName: any;
  selectedFile: any;
  resumeUploadSuccess: boolean = false;
  fileInputClicked: boolean = false;
  uploadedFileKey: string = '';
  today: Date = new Date();
  messageSaved: boolean = false;
  offerSalary: any;
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

  saveClick(event: Event) {
    // this.updateHtmlContent(message);
    this.isEditable = false;
    this.messageSaved = true;
    // this.updateHtmlContent(event);
    // this.templateData.message = this.content;
    const templateElement = this.templateRef.nativeElement;
    this.htmlString = templateElement.innerHTML;
    console.log(event);
    
  }

  updateHtmlContent(event: any): void {
    this.content = event?.target?.value ? event?.target?.value : this.templateData.message;
    console.log("bghfhbn",this.content);
    
    this.templateData.message = this.content;
    const templateElement = this.templateRef.nativeElement;
    this.htmlString = templateElement.innerHTML;
  }

  submitClick(): void {
    if (!this.messageSaved) {
      this.tostr.warning(this.isEditable ? 'Please Save Template before submitting' : 'Please Edit and Save Mail before submitting');
      return;
    }
  
    this.feedback = (document.getElementById('feedback') as HTMLInputElement)?.value || '';
    this.mailCc = (document.getElementById('cc') as HTMLInputElement)?.value || '';
    this.mailBcc = (document.getElementById('bcc') as HTMLInputElement)?.value || '';
    this.mailSubject = (document.getElementById('subject') as HTMLInputElement)?.value || '';
    this.offerSalary = (document.getElementById('salary') as HTMLInputElement)?.value || '';
  
    if (this.isEditable) {
      this.tostr.warning('Please Save Changes in Mail');
      return;
    }
  
    const confirmationCheckbox = document.getElementById('confirmDetails') as HTMLInputElement;
    if (!confirmationCheckbox?.checked || !this.candidate?.messageType.trim()) {
      this.tostr.warning('Please confirm all details before submitting');
      return;
    }
  
    if (this.templateRef) {
      const templateElement = this.templateRef.nativeElement;
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
      
      this.htmlString = templateElement.outerHTML.replace(textarea, '<div>');
  
      if (this.htmlString && this.feedback.trim() && this.mailSubject.trim()) {
        const data = {
          feedback: this.feedback,
          offerSalary: this.offerSalary,
          joiningdate: this.displayDate,
          mailCc: this.mailCc,
          mailBcc: this.mailBcc,
          mailSubject: this.mailSubject,
          messageType: this.candidate?.messageType,
          mailTemp : this.htmlString,
        };
        this.submitData.emit(data);
        console.log(data);
      } else {
        if (!this.feedback.trim()) this.tostr.warning('Please Add a feedback');
        if (!this.mailSubject.trim()) this.tostr.warning('Please Add a Subject');
      }
    }
  }
  
  // submitClickTest() {
  //   const payload = {
  //     // serviceSeqId: this.serviceId,
  //     // feedBack: this.feedback,
  //     // feedBackBy: this.userId,
  //     mailId: 'alfiya.sr@techversantinfotech.com',
  //     cc: this.mailCc,
  //     message: this.htmlString,
  //     subject: this.mailSubject,
  //   };
  //   this.apiService.post(`/candidate/send-mail`, payload).subscribe({
  //     next: (res: any) => {
  //       this.tostr.success('Approval successful');
  //       // this.closeDialog();
  //     },
  //     error: (error) => this.tostr.error('Error during approval')
  //   });

  // }

  cancelClick() {
    const data = {clickType: 'cancel'};
    this.submitData.emit(data);
   }

}
