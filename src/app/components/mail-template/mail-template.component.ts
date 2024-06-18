import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { S3Service } from 'src/app/services/s3.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-mail-template',
  templateUrl: './mail-template.component.html',
  styleUrls: ['./mail-template.component.css']
})
export class MailTemplateComponent implements OnInit {
  @Input() candidate: any;
  @Output() submitData: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('template', { static: false }) templateRef!: ElementRef;
  @ViewChild('recruiterNameDiv') recruiterNameDiv!: ElementRef;
  @ViewChild('positionDiv') positionDiv!: ElementRef;
  @ViewChild('panelDiv') panelDiv!: ElementRef;
  isEditable: boolean = false;
  templateData: any = {};
  content: string = '';
  htmlString: any;
  candidateId: any;
  feedback: any;
  mailCc: any;
  mailSubject: any;
  displayDate: any;
  mailBcc: any;
  file: File | null = null;
  fileName: string = '';
  selectedFile: any;
  resumeUploadSuccess: boolean = false;
  fileInputClicked: boolean = false;
  uploadedFileKey: string = '';
  today: Date = new Date();
  messageSaved: boolean = false;
  offerSalary: any;
  private keySubscription?: Subscription;
  showPanel: boolean = false;
  showRecruiters: boolean = false;
  showDropdown: boolean = false;
  showcandidate: boolean = false;
  panelName: any;
  panel_list: any;
  interviewStatus: string = "";
  displayTime: any;
  panelId: any;
  showModeList: boolean = false;
  modeList: any;
  selectedModeName: string = "";
  selectedModeId: any;
  candidateDetails: any;
  scheduledDate: any;
  candidateExperience: any;
  currentCompany: any;
  candidateStatus: any;
  noticeperiodvalue: any;
  id: any;
  serviceId: any;
  interviewMode: any;
  comment: any;
  Interviewlocation: any;
  displaydateTime: any;
  loader: boolean = false;
  showTemplate:boolean = false;
  constructor(private apiService: ApiService, private tostr: ToastrService, private datePipe: DatePipe, private s3Service: S3Service, private http: HttpClient) { }
  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.candidate?.messageType && this.candidate?.messageType !== '') {
      this.showTemplate = true;
      this.fetchTemplates();
      if (this.candidate?.messageType === 're-schedule') this.fetchCandidatesDetails();
      this.fetchMode();
      this.fetchPanel();
    }else this.showTemplate = false;

  }
  // @HostListener('document:click', ['$event'])
  // onBodyClick(event: Event): void {
  //   const clickedElement = event.target as HTMLElement;
  //   if (!this.recruiterNameDiv.nativeElement.contains(clickedElement)) this.showRecruiters = false;
  //   if (!this.positionDiv.nativeElement.contains(clickedElement)) this.showDropdown = false;
  //   if (this.candidate?.candidateFirstName) this.showcandidate = false;
  //   if (!this.panelDiv.nativeElement.contains(clickedElement)) this.showPanel = false;
  // }

  fetchPanel(): void {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEyLCJ1c2VyVHlwZSI6ImFkbWluIiwidXNlckVtYWlsIjoiYWRtaW5AbWFpbGluYXRvci5jb20ifQ.Uva57Y4MMA0yWz-BYcRD-5Zzth132GMGJkFVQA3Tn50',
      'ngrok-skip-browser-warning': 'true'
    });
    this.http.get(`${environment.api_url}/user/lists?userRole=2`, { headers }).subscribe((res: any) => {
      if (res?.users) this.panel_list = res?.users;
    })
  }

  selectPanel(panelid: any, firstname: any, secondName: any): void {
    this.showPanel = false;
    this.panelId = panelid;
    this.panelName = `${firstname} ${secondName}`;
  }

  changeInterviewStatus(): void {
    if (this.displayDate && this.displayTime) {
      if (!this.interviewStatus) this.interviewStatus = 'Scheduled';
      if (this.interviewStatus === 'Not yet Schedule') this.interviewStatus = 'scheduled';
    }
  }


  fetchMode(): void {
    this.apiService.get(`/screening-station/interview-mode/list`).subscribe((res: any) => {
      if (res?.data) this.modeList = res?.data;
    })
  }

  selectMode(id: any, name: any): void {
    this.selectedModeId = id;
    this.selectedModeName = name;
  }

  fetchCandidatesDetails(): void {
    this.apiService.get(`/screening-station/interview-details/candidate-detail?candidateId=${this.candidate?.id}`).subscribe((res: any) => {
      this.candidateDetails = res?.candidate;
      this.candidateStatus = res?.candidateStatus;
      this.candidateDetails.forEach((candidate: any) => {
        this.candidateExperience = candidate?.candidateExperience;
        this.currentCompany = candidate?.candidatePreviousOrg;
        this.id = candidate?.candidateId;
        if (candidate?.candidateNoticePeriodByDays) this.noticeperiodvalue = candidate?.candidateNoticePeriodByDays;
      })
      this.candidateStatus.forEach((status: any) => {
        this.serviceId = this.candidate?.serviceId;
        if (status?.interviewMode) this.interviewMode = status?.interviewMode;
        if (status?.comment) this.comment = status?.comment;
        if (status?.interviewStatus) this.interviewStatus = status?.interviewStatus;
        if (status?.interviewLocation) this.Interviewlocation = status?.interviewLocation;
        this.scheduledDate = status?.serviceDate;
        if (this.scheduledDate) {
          this.displayDate = this.datePipe.transform(this.scheduledDate, 'MM/dd/yyyy');
          this.displayTime = this.datePipe.transform(this.scheduledDate, 'hh:mm');          
        }
      })
    })
  }

  fetchTemplates(): void {
    this.apiService.get(`/candidate/mail/template?msgType=${this.candidate?.messageType}&candidateId=${this.candidate?.id}`).subscribe((res: any) => {
      if (res?.data) {
        this.templateData = res?.data;
      }
    })
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

  // onFileSelected(event: any): void {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     this.file = file;
  //     this.fileName = file?.name;
  //   }
  // }

  onTimeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.displayTime = input.value;
    if (this.interviewStatus === 'scheduled') this.interviewStatus = 'Rescheduled'
    this.changeInterviewStatus();
  }


  timeChange(event: any): void {
    this.displayTime = event;

  }
  
  getKeyFroms3(): void {
    this.keySubscription = this.s3Service.key.subscribe((key: string) => {
      this.uploadedFileKey = key;
      if (!this.uploadedFileKey) {
        this.loader = true;
        this.tostr.warning('File upload is in progress, please wait.');
      } else {
        this.loader = false;
      }
    });
  }


  dateChange(event: any): void {
    let date = new Date(event?.value);
    this.displayDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    if (this.interviewStatus === 'scheduled') this.interviewStatus = 'Rescheduled';
    this.changeInterviewStatus();
  }

  editClick() {
    this.isEditable = true;
  }

  saveClick(event: Event): void {
    if (this.content.trim() === '') {
      this.tostr.warning('Please Edit and Save Mail before submitting');
      return;
    }
    this.isEditable = false;
    this.messageSaved = true;
  }


  updateHtmlContent(event: any): void {
    this.content = event?.target?.value ? event?.target?.value : '';
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

    if (this.displayDate && this.displayDate) this.displaydateTime = `${this.displayDate} ${this.displayTime}`;
    // if (this.scheduledDate) this.displaydateTime = this.scheduledDate;

    if (this.isEditable) {
      this.tostr.warning('Please Save Changes in Mail');
      return;
    }
    // Validate confirmation checkbox and message type
    const confirmationCheckbox = document.getElementById('confirmDetails') as HTMLInputElement;
    if (!confirmationCheckbox?.checked || !this.candidate?.messageType.trim()) {
      this.tostr.warning('Please confirm all details before submitting');
      return;
    }
    // Process the template content
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
    }

    // Validate feedback and subject fields
    if (!this.feedback.trim() || !this.mailSubject.trim()) {
      if (!this.feedback.trim()) this.tostr.warning('Please Add a feedback');
      if (!this.mailSubject.trim()) this.tostr.warning('Please Add a Subject');
      return;
    }

    const commonData = {
      feedback: this.feedback,
      mailCc: this.mailCc,
      mailBcc: this.mailBcc,
      mailSubject: this.mailSubject,
      messageType: this.candidate?.messageType,
      mailTemp: this.htmlString,
    };

    let data;
    if (this.candidate?.messageType === 'offer') {
      if (!this.uploadedFileKey || !this.offerSalary || !this.displayDate) {
        if (!this.uploadedFileKey) this.tostr.warning('Please Wait file to be uploaded');
        if (!this.offerSalary) this.tostr.warning('Please Add Offer Salary');
        if (!this.displayDate) this.tostr.warning('Please Select Joining Date');
        return;
      }
      data = {
        ...commonData,
        file: this.uploadedFileKey,
        offerSalary: this.offerSalary,
        joiningdate: this.displayDate,
      };
    } else if (this.candidate?.messageType === 'rejection') {
      data = commonData;
    } else {
      // Validate interview details
      if (!this.panelId || !this.selectedModeName || !this.interviewStatus || !this.displaydateTime) {
        if (!this.panelId) this.tostr.warning('Please Select an Interview Panel');
        if (!this.selectedModeName) this.tostr.warning('Please Select an Interview Mode');
        if (!this.interviewStatus) this.tostr.warning('Please Select an Interview Status');
        if (!this.displaydateTime) this.tostr.warning('Please Enter an Interview Time');
        return;
      }

      data = {
        ...commonData,
        interviewPanel: this.panelId,
        interviewMode: this.selectedModeName,
        interviewStatus: this.interviewStatus,
        interviewTime: this.displaydateTime
      };
    }
    this.submitData.emit(data);
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
    const data = { clickType: 'cancel' };
    this.submitData.emit(data);
  }

}
