import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { ToastrServices } from 'src/app/services/toastr.service';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ControlContainer } from '@angular/forms';
@Component({
  selector: 'app-interview-details',
  templateUrl: './interview-details.component.html',
  styleUrls: ['./interview-details.component.css'],
  providers: [DatePipe],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
})

export class InterviewDetailsComponent implements OnInit {
  showPanel: boolean = false;
  candidate_list: any;
  users_list: any;
  recruiterId: any;
  recruiterName: string = '';
  positionId: any;
  positionName: string = '';
  candidateId: any;
  candidateName: string = '';
  currentCompany: string = '';
  modeValue: any;
  selectedCandidate: any[] = [];
  location: any;
  interviewStatus: string = '';
  candidateDetails: any;
  candidateStatus: any[] = [];
  noticeperiodvalue: string = '';
  serviceId: any;
  interviewMode: string = '';
  Interviewlocation: string = '';
  comment: string = '';
  scheduledDate: any;
  today: any;
  id: any;
  seachKeyword: string = '';
  candidatesList: any;
  candidate: any;
  modeList: any[] = [];
  selectedModeId: any;
  showModeList: boolean = false;
  scheduleStatus: boolean = false;
  loader: boolean = false;
  messageType: string = '';
  mailTemplateData: any;
  candidateRevlentExperience: any;
  candidateTotalExperience: any;
  workModeList: any;
  showWorkMode: boolean = false;
  selectedModeName: string = "";
  candidateCount: any;
  candidateFirstName: any;
  candidateLastName: any;
  locationName: string = '';
  locationList: any;
  showJobLocation: boolean = false;
  constructor(private tostr: ToastrServices, private apiService: ApiService, public dialogRef: MatDialogRef<InterviewDetailsComponent>, @Inject(MAT_DIALOG_DATA)
  public data: any,
  ) {
    if (data) this.data = data
    this.dialogRef.updateSize('60vw', '90vh');
    this.candidate = data?.candidate;
    this.positionName = this.candidate['serviceSequence.serviceRequest.requestName'] ?? this.candidate['reqServiceRequest.requestName'] ?? '';
    this.positionId = this.candidate?.candidatesAddingAgainst ?? '';
    this.scheduleStatus = true;
  
    this.serviceId = '';
    this.candidateId = this.candidate?.candidateId ?? '';
    this.currentCompany = this.candidate?.candidatePreviousOrg ?? '';
    this.candidateRevlentExperience = this.candidate?.candidateRevlentExperience ?? '';
    this.candidateTotalExperience = this.candidate?.candidateTotalExperience ?? '';
    this.candidateName = (this.candidate?.candidateFirstName ?? '') + ' ' + (this.candidate?.candidateLastName ?? '');
    this.noticeperiodvalue = this.candidate?.candidateNoticePeriodByDays ?? '';
    this.fetchUsers();
    // this.fetchCandidates();
    this.fetchWorkMode();
    this.fetchMode();
    this.fetchLocation();
    this.showMail('screening');
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.returnValue = true;
  }
  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.showWorkMode = false;
      this.showJobLocation = false;
    }
  }

  ngOnInit(): void {
    this.recruiterId = localStorage.getItem('userId');
    this.today = new Date();
  }

  fetchCandidates() {
    if (this.positionId) {
      this.apiService.get(`/screening-station/interview-details/candidates-list?serviceRequestId=${this.positionId}&scheduleStatus=${this.scheduleStatus}`).subscribe({
        next: (res: any) => {
          if (res?.candidates) {
            this.candidate_list = res?.candidates;
            this.candidateCount = res?.candidateCount
          }
        },
        error: (err) => {
          this.tostr.error("Error fetching candidates.");
        }
      });
    } else {
      this.tostr.warning("Make sure to select the position dropdown first");
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  fetchUsers(): void {
    this.apiService.get(`/user/lists?userRole=1`).subscribe((res: any) => {
      if (res?.users) this.users_list = res?.users;
    })
  }

  fetchWorkMode(): void {
    this.apiService.get(`/user/work-modes`).subscribe({
      next: (res: any) => {
        if (res?.data) this.workModeList = res?.data;
      },
      error: (err) => {
        this.tostr.error("Error fetching Work Mode.");
      }
    });
  }

  selectMode(mode: any): void {
    this.selectedModeName = mode;
    this.showWorkMode = false;
  }

  showMail(type: string): void {
    this.messageType = type;
    this.mailTemplateData = {
      firstName: this.candidate?.candidateFirstName ? this.candidate.candidateFirstName : this.candidateFirstName,
      lastName: this.candidate?.candidateLastName ? this.candidate.candidateLastName : this.candidateLastName,
      id: this.candidate?.candidateId ? this.candidate?.candidateId : this.candidateId,
      messageType: this.messageType,
    };
  }

  fetchCandidatesDetails(): void {
    this.apiService.get(`/screening-station/interview-details/candidate-detail?candidateId=${this.candidateId}`).subscribe((res: any) => {
      this.candidateDetails = res?.candidate;
      this.candidateStatus = res?.candidateStatus;
      this.showMail('re-schedule');
      this.candidateDetails.forEach((candidate: any) => {
        this.candidateRevlentExperience = candidate?.candidateRevlentExperience ?? '';
        this.candidateTotalExperience = candidate?.candidateTotalExperience ?? '';
        this.currentCompany = candidate?.candidatePreviousOrg ?? '';
        this.id = candidate?.candidateId ?? '';
        if (candidate?.candidateNoticePeriodByDays) this.noticeperiodvalue = candidate?.candidateNoticePeriodByDays ?? '';
      })
      this.candidateStatus.forEach((status: any) => {
        this.serviceId = status?.serviceId;
        if (status?.interviewMode) this.interviewMode = status?.interviewMode ?? '';
        if (status?.comment) this.comment = status?.comment ?? '';
        if (status?.interviewStatus) this.interviewStatus = status?.interviewStatus ?? '';
        if (status?.interviewLocation) this.Interviewlocation = status?.interviewLocation ?? '';
      })
    })
  }

  fetchMode(): void {
    this.apiService.get(`/screening-station/interview-mode/list`).subscribe((res: any) => {
      if (res?.data) this.modeList = res?.data;
    })
  }

  fetchLocation(): void {
    this.apiService.get(`/user/preffer-location`).subscribe((res: any) => {
      if (res?.data) this.locationList = res?.data;
    })
  }

  onSubmitData(event: any): void {
    if (event?.clickType === 'cancel') this.cancelClick();
    else this.submitClick(event);
  }

  submitClick(data: any): void {
    this.loader = true;
    const noticeperiod = document.getElementById('noticePeriod') as HTMLInputElement;
    this.noticeperiodvalue = noticeperiod?.value ? noticeperiod?.value : this.noticeperiodvalue;
    if (this.locationName && this.recruiterId && this.selectedModeName && data) {
      const payload = {
        recruiterId: this.recruiterId,
        candidateId: this.candidateId,
        noticePeriod: this.noticeperiodvalue,
        position: this.candidate["serviceSequence.serviceRequest.requestId"] ?? '',
        location: this.locationName,
        interviewTime: data?.interviewTime,
        interViewPanel: data?.interviewPanel,
        interviewMode: data?.interviewMode,
        // serviceId: this.candidate?.serviceId ?? '',
        serviceId: '',
        station: this.candidateDetails?.candidateStation ?? '1',
        interviewStatus: data?.interviewStatus,
        comments: data?.feedback,
        workMode: this.selectedModeName ?? '',
        revelantWorkExperience: this.candidateRevlentExperience,
        totalWorkExperience: this.candidateTotalExperience,
        interviewCc: data?.mailCc,
        interviewMailTemp: data?.mailTemp,
        interviewSubject: data?.mailSubject,
        interviewBcc: data?.mailBcc,
      }

      this.apiService.post(`/screening-station/interview-details`, payload).subscribe({
        next: (res: any) => {
          this.loader = false;
          this.tostr.success('Interview Scheduled Successfully');
          this.resetFormAndState('');
          this.closeDialog();
        },
        error: (error) => {
          this.loader = false;
          if (error?.status === 500) this.tostr.error("Internal Server Error");
          else this.tostr.warning("Unable to update");
          this.closeDialog();
        }
      });
    } else {
      this.loader = false;
      if (!this.noticeperiodvalue) this.tostr.warning('Please Add Notice period');
      if (!this.locationName) this.tostr.warning('Please Add Job location');
      if (!this.recruiterId) this.tostr.warning('Please Select Recruiter');
      if (!this.selectedModeName) this.tostr.warning('Please Select Work Mode');
    }
  }

  selectLocation(name: any): void {
    this.locationName = name;
    this.showJobLocation = false;
  }

  clearInputvalue(id: string) {
    const inputElement = document.getElementById(id) as HTMLInputElement;
    if (inputElement) inputElement.value = '';
  }

  resetFormAndState(item: any): void {
    this.recruiterName = '';
    this.currentCompany = '';
    this.selectedModeName = '';
    this.candidateName = '';
    this.locationName = '';
    this.noticeperiodvalue = '';
    this.Interviewlocation = '';
    this.candidateRevlentExperience = '';
    this.candidateTotalExperience = '';
    this.clearInputvalue('location');
    this.clearInputvalue('mode');
    this.clearInputvalue('interviewStatus');
    this.clearInputvalue('candidateStatus');
    this.clearInputvalue('rescheduledStatus');
    this.clearInputvalue('noticePeriod');
    this.showMail('');
    this.candidate_list = [];

    if (item !== 'position') {
      this.positionName = '';
    }
  }

  cancelClick(): void {
    this.resetFormAndState('');
    this.closeDialog();
  }

}
