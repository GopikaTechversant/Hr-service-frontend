import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { ToastrServices } from 'src/app/services/toastr.service';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  showDropdown: boolean = false;
  showRecruiters: boolean = false;
  showcandidate: boolean = false;
  showPanel: boolean = false;
  displayDate: any;
  displayTime: any;
  displaydateTime: any;
  candidate_list: any;
  users_list: any;
  recruiterId: any;
  recruiterName: string = '';
  positionList: any;
  positionId: any;
  positionName: string = '';
  candidateId: any;
  candidateName: string = '';
  candidateExperience: any;
  currentCompany: string = '';
  modeValue: any;
  interviewStatusValue: any;
  rescheduledStatusValue: any;
  commentValue: any = '';
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
    this.positionName = this.candidate['reqServiceRequest.requestName'] ?? '';
    this.positionId = this.candidate?.candidatesAddingAgainst ?? '';
    this.scheduleStatus = true;
    this.serviceId = '';
    this.candidateId = this.candidate?.candidateId ?? '';
    this.currentCompany = this.candidate?.candidatePreviousOrg ?? '';
    this.candidateRevlentExperience = this.candidate?.candidateRevlentExperience ?? '';
    this.candidateTotalExperience = this.candidate?.candidateTotalExperience ?? '';
    this.candidateName = (this.candidate?.candidateFirstName ?? '') + ' ' + (this.candidate?.candidateLastName ?? '');
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
      this.showDropdown = false;
      this.showcandidate = false;
      this.showRecruiters = false;
      this.showWorkMode = false;
      this.showJobLocation = false;
    }
  }

  ngOnInit(): void {
    this.recruiterId = localStorage.getItem('userId');
    this.today = new Date();
    this.fetchPosition();
  }

  fetchPosition(): void {
    this.apiService.get(`/service-request/list`).subscribe({
      next: (res: any) => {
        if (res?.data) this.positionList = res?.data;
      },
      error: (err) => {
        this.tostr.error("Error fetching position.");
      }
    });
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

  candidateClick(): void {
    if (this.positionName.trim() !== '') {
      if (this.candidateCount === 0) {
        this.showcandidate = false;
        this.tostr.warning('Selected Requirement Has no Candidate');
      } else this.showcandidate = !this.showcandidate;
    } else this.tostr.warning('Please Select a Requirement First')
  }

  selectPosition(id: any, name: any): void {
    this.showDropdown = false;
    this.positionId = id;
    this.positionName = name;
    this.fetchUsers();
    this.fetchCandidates();
    this.fetchWorkMode();
    this.fetchMode();
    this.fetchLocation();
    this.resetFormAndState('position');
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

  fetchcandidatesWithExperience(search: string): void {
    this.seachKeyword = search;
    this.apiService.get(`/screening-station/interview-details/candidates-list?serviceRequestId=${this.positionId}&exprience=${this.seachKeyword}`).subscribe((res: any) => {
      if (res?.candidates) {
        this.candidatesList = [];
        this.candidatesList = res?.candidates;
      }
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

  selectCandidate(candidateId: any, candidateFirstName: any, candidateLastName: any, candidate: any): void {
    this.showcandidate = false;
    this.candidateId = candidateId;
    this.candidateFirstName = candidateFirstName;
    this.candidateLastName = candidateLastName
    this.candidateName = `${candidateFirstName} ${candidateLastName}`;
    this.selectedCandidate = candidate;
    if (this.selectedCandidate) {
      this.fetchCandidatesDetails();
    }
  }

  searchExperience(search: string): void {
    this.seachKeyword = search;
    this.fetchcandidatesWithExperience(this.seachKeyword);
  }

  candidateSelectChange(item: any): void {
    this.candidate = item;
    this.candidate.selected = !this.candidate.selected;
    if (this.candidate !== null) {
      if (this.candidate.selected) {
        if (this.selectedCandidate.indexOf(item?.candidateId) === -1) this.selectedCandidate.push(item?.candidateId);
      } else {
        const index = this.selectedCandidate.indexOf(item?.candidateId);
        if (index > -1) this.selectedCandidate.splice(index, 1);
      }
    }
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
        position: this.positionId,
        location: this.locationName,
        interviewTime: data?.interviewTime,
        interViewPanel: data?.interviewPanel,
        interviewMode: data?.interviewMode,
        serviceId: this.serviceId ?? '',
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
      if (!this.locationName) this.tostr.warning('Please Add Interview location');
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
    this.showRecruiters = false;
    this.showDropdown = false;
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
