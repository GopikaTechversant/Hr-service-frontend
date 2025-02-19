import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { S3Service } from 'src/app/services/s3.service';

@Component({
  selector: 'app-mail-template',
  templateUrl: './mail-template.component.html',
  styleUrls: ['./mail-template.component.css'],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
})
export class MailTemplateComponent implements OnInit {
  @Input() candidate: any;
  @Output() submitData: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('template', { static: false }) templateRef!: ElementRef;
  @ViewChild('recruiterNameDiv') recruiterNameDiv!: ElementRef;
  @ViewChild('positionDiv') positionDiv!: ElementRef;
  @ViewChild('panelDiv') panelDiv!: ElementRef;
  @Input() initialLoader: boolean = false;
  @Input() loader: boolean = false;
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
  panel_list: any[] = [];
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
  comment: any;
  Interviewlocation: any;
  displaydateTime: any;
  showTemplate: boolean = false;
  showTimePicker: Boolean = false;
  fileUploader: boolean = false;
  InterviewTime: any;
  isSubmitting: boolean = false;
  panelSearchValue: string = '';
  searchvalue: string = "";

  constructor(private apiService: ApiService, private tostr: ToastrService, private datePipe: DatePipe, private s3Service: S3Service) { }
  ngOnInit(): void {
    this.resetFormAndState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.candidate?.messageType && this.candidate?.messageType !== '') {
      this.showTemplate = true;
      this.fetchTemplates();
      this.resetFormAndState();
      if (this.candidate?.messageType === 're-schedule') this.fetchCandidatesDetails();
      this.fetchMode();
      // this.fetchPanel();
    } else this.showTemplate = false;
  }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.showPanel = false;
      this.showModeList = false;
    }
  }

  openTimePicker(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.click();
  }

  // fetchPanel(): void {
  //   this.apiService.get(`/user/lists?userRole=3`).subscribe((res: any) => {
  //     if (res?.users) this.panel_list = res?.users;
  //   })
  // }

  selectPanel(panelid: any, firstname: any, secondName: any): void {
    this.showPanel = false;
    this.panelId = panelid;
    this.panelName = `${firstname} ${secondName}`;
    this.panelSearchValue = `${firstname} ${secondName}`;
    console.log(" this.panelId", this.panelId);
    
    if (this.candidate?.messageType === 're-schedule') this.changeInterviewStatus();
  }

  changeInterviewStatus(): void {
    if (this.displayDate || this.displayTime || this.selectedModeName || this.panelName) {
      if (!this.interviewStatus) this.interviewStatus = 'Scheduled';
      if (this.interviewStatus === 'Not yet Schedule') this.interviewStatus = 'scheduled';
      if (this.interviewStatus === 'scheduled') this.interviewStatus = 'Re-Scheduled';
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
    if (this.candidate?.messageType === 're-schedule') this.changeInterviewStatus();
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
        if (status?.interviewMode) this.selectedModeName = status?.interviewMode;
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
    const file: File = event?.target?.files?.[0];
    if (file) {
      this.file = file;
      this.fileName = file?.name;
      this.fileUploader = true;
      if (this.fileName) this.s3Service.uploadImage(this.file, 'prod-ats-docs', this.file);
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
    this.displayTime = input.value; // e.g., "14:30"

    // Convert the displayTime to 12-hour format with AM/PM
    this.InterviewTime = this.convertTo12HourFormat(this.displayTime);

    if (this.interviewStatus === 'scheduled') {
      this.interviewStatus = 'Rescheduled';
    }
    this.changeInterviewStatus();
  }

  convertTo12HourFormat(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // '0' should be '12'
    return `${this.padZero(hours12)}:${this.padZero(minutes)} ${period}`;
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  getKeyFroms3(): void {
    this.keySubscription = this.s3Service.key.subscribe((key: string) => {
      this.uploadedFileKey = key;
      if (!this.uploadedFileKey) {
        this.fileUploader = false;
        this.tostr.error('Something Went Wrong Please Try Again');
      } else {
        this.fileUploader = false;
        this.tostr.success('File upload Successfully');
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
    // Extract input values
    this.feedback = (document.getElementById('feedback') as HTMLInputElement)?.value || '';
    this.mailCc = (document.getElementById('cc') as HTMLInputElement)?.value || '';
    this.mailBcc = (document.getElementById('bcc') as HTMLInputElement)?.value || '';
    this.mailSubject = (document.getElementById('subject') as HTMLInputElement)?.value || '';
    this.offerSalary = (document.getElementById('salary') as HTMLInputElement)?.value || '';
    if (this.displayDate && this.displayTime) {
      const combinedDateTime = `${this.displayDate} ${this.displayTime}`;
      const parsedDate = new Date(combinedDateTime);
      // Convert to ISO 8601 format
      this.displaydateTime = parsedDate.toISOString();
    }

    if (this.isEditable) {
      this.tostr.warning('Please Save Changes in Mail');
      return;
    }

    // Check for confirmation checkbox and message type
    const confirmationCheckbox = document.getElementById('confirmDetails') as HTMLInputElement;
    if (!confirmationCheckbox?.checked || !this.candidate?.messageType.trim()) {
      this.tostr.warning('Please confirm all details before submitting');
      return;
    }

    // Email validation logic
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    // Function to validate a list of email addresses separated by commas
    const validateEmails = (emails: string): boolean => {
      const emailArray = emails.split(',').map(email => email.trim());
      return emailArray.every(email => emailPattern.test(email));
    };

    // Validate mailCc and mailBcc
    if (this.mailCc && !validateEmails(this.mailCc)) {
      this.tostr.warning('Invalid email address found in CC field');
      return;
    }
    if (this.mailBcc && !validateEmails(this.mailBcc)) {
      this.tostr.warning('Invalid email address found in BCC field');
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
      if (!this.offerSalary || !this.displayDate) {
        // if (!this.uploadedFileKey) this.tostr.warning('Please Wait for the file to be uploaded');
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
        interviewTime: this.displaydateTime,
      };
    }
    // Emit the data
    this.submitData.emit(data);
  }

  clearInputvalue(id: string) {
    const inputElement = document.getElementById(id) as HTMLInputElement;
    if (inputElement) inputElement.value = '';
  }

  resetFormAndState(): void {
    this.currentCompany = '';
    this.selectedModeName = '';
    this.showRecruiters = false;
    this.showDropdown = false;
    this.panelName = '';
    this.selectedModeName = '';
    this.noticeperiodvalue = '';
    this.Interviewlocation = '';
    this.scheduledDate = '';
    this.displayTime = '';
    this.fileName = '';
    this.displayTime = '';
    this.displayTime = '';
    this.displayTime = '';

    this.clearInputvalue('joining');
    this.clearInputvalue('salary');
    this.clearInputvalue('interviewStatus');
    this.clearInputvalue('subject');
    this.clearInputvalue('rescheduledStatus');
    this.clearInputvalue('cc');
    this.clearInputvalue('bcc');
    this.clearInputvalue('feedback');
  }

  cancelClick() {
    const data = { clickType: 'cancel' };
    this.submitData.emit(data);
  }

  getRequsitionSuggestion(event: any) {
    this.showPanel = true;
    this.panelSearchValue = event?.target.value;
    this.apiService.get(`/user/lists?userRole=3&search=${this.panelSearchValue}`).subscribe((res: any) => {
      if (res?.users) this.panel_list = res?.users.filter((suggestion: any) =>
        suggestion.userfirstName.toLowerCase().startsWith(this.searchvalue.toLowerCase())
      );
    });
  }

  clearFilter(): void {
    this.panelName = '';
    this.panelSearchValue = '';
    this.showPanel = false;
    this.searchvalue = '';
    this.panelId = '';
    // this.displayPosition = '';
    // this.positionId = '';
    // this.panelSearchValue = '';
    // this.selectedRequsition = '';
    // this.showPanel = false;
    // this.searchvalue = '';
  }

}
