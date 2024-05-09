import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { ToastrServices } from 'src/app/services/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-interview-details',
  templateUrl: './interview-details.component.html',
  styleUrls: ['./interview-details.component.css'],
  providers: [DatePipe],
})

export class InterviewDetailsComponent implements OnInit {
  @ViewChild('recruiterNameDiv') recruiterNameDiv!: ElementRef;
  @ViewChild('positionDiv') positionDiv!: ElementRef;
  @ViewChild('candidatenameDiv') candidatenameDiv!: ElementRef;
  @ViewChild('panelDiv') panelDiv!: ElementRef;
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
  recruiterName: any;
  positionList: any;
  positionId: any;
  positionName: any;
  candidateId: any;
  candidateName: any;
  candidateExperience: any;
  currentCompany: any;
  locationValue: string = '';
  panelId: any;
  panelName: any;
  panel_list: any;
  modeValue: any;
  interviewStatusValue: any;
  rescheduledStatusValue: any;
  commentValue: any = '';
  selectedCandidate: any[] = [];
  location: any;
  interviewStatus: string = '';
  candidateDetails: any[] = [];
  candidateStatus: any[] = [];
  noticeperiodvalue: any = '';
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
  selectedModeName: string = '';
  selectedModeId: any;
  showModeList: boolean = false;
  scheduleStatus: boolean = false;
  loader: boolean = false;
  constructor(private datePipe: DatePipe, private http: HttpClient, private tostr: ToastrServices, private apiService: ApiService) { }

  ngOnInit(): void {
    this.today = new Date();
    this.fetchPosition();
    this.fetchMode();
    if (history?.state?.candidate) {
      this.candidate = history?.state?.candidate;
      this.positionName = this.candidate['reqServiceRequest.requestName'];
      this.positionId = this.candidate?.candidatesAddingAgainst;
      this.scheduleStatus = true;
      this.serviceId = '';
      this.candidateId = this.candidate?.candidateId;
      this.currentCompany = this.candidate?.candidatePreviousOrg;
      this.fetchUsers();
      this.fetchCandidates();
      this.fetchPanel();
    }
  }
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.returnValue = true;
  }

  @HostListener('document:click', ['$event'])
  onBodyClick(event: Event): void {
    const clickedElement = event.target as HTMLElement;
    if (!this.recruiterNameDiv.nativeElement.contains(clickedElement)) this.showRecruiters = false;
    if (!this.positionDiv.nativeElement.contains(clickedElement)) this.showDropdown = false;
    if (!this.candidatenameDiv.nativeElement.contains(clickedElement)) this.showcandidate = false;
    if (!this.panelDiv.nativeElement.contains(clickedElement)) this.showPanel = false;
  }

  fetchPosition(): void {
    this.apiService.get(`/service-request/list`).subscribe((res: any) => {
      if (res?.data) this.positionList = res?.data;
    })
  }

  fetchCandidates() {
    if (this.positionId) {
      this.apiService.get(`/screening-station/interview-details/candidates-list?serviceRequestId=${this.positionId}&scheduleStatus=${this.scheduleStatus}`).subscribe((res: any) => {
        if (res?.candidates) {
          this.candidate_list = res?.candidates;
          this.candidatesList = res?.candidates;
        }
      })
    } else {
      this.tostr.warning("Make sure to select the position dropdown first");
    }
  }

  fetchUsers(): void {
    console.log("fetch");
    
    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEyLCJ1c2VyVHlwZSI6ImFkbWluIiwidXNlckVtYWlsIjoiYWRtaW5AbWFpbGluYXRvci5jb20ifQ.Uva57Y4MMA0yWz-BYcRD-5Zzth132GMGJkFVQA3Tn50',
      // 'ngrok-skip-browser-warning': 'true'
    });
    this.http.get(`${environment.api_url}/user/lists?userRole=1`, { headers }).subscribe((res: any) => {
      if (res?.users) this.users_list = res?.users;
      console.log(" res?.users;", res?.users);
      
    })
  }

  fetchPanel(): void {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEyLCJ1c2VyVHlwZSI6ImFkbWluIiwidXNlckVtYWlsIjoiYWRtaW5AbWFpbGluYXRvci5jb20ifQ.Uva57Y4MMA0yWz-BYcRD-5Zzth132GMGJkFVQA3Tn50',
      // 'ngrok-skip-browser-warning': 'true'
    });
    this.http.get(`${environment.api_url}/user/lists?userRole=2`, { headers }).subscribe((res: any) => {
      if (res?.users) this.panel_list = res?.users;
    })
  }

  fetchCandidatesDetails(): void {
    this.apiService.get(`/screening-station/interview-details/candidate-detail?candidateId=${this.candidateId}`).subscribe((res: any) => {
      this.candidateDetails = res?.candidate;
      this.candidateStatus = res?.candidateStatus;
      this.candidateDetails.forEach((candidate: any) => {
        this.candidateExperience = candidate?.candidateExperience;
        this.currentCompany = candidate?.candidatePreviousOrg;
        this.id = candidate?.candidateId;
        if (candidate?.candidateNoticePeriodByDays) this.noticeperiodvalue = candidate?.candidateNoticePeriodByDays;
      })
      this.candidateStatus.forEach((status: any) => {
        this.serviceId = status?.serviceId;
        if (status?.interviewMode) this.interviewMode = status?.interviewMode;
        if (status?.comment) this.comment = status?.comment;
        if (status?.interviewStatus) this.interviewStatus = status?.interviewStatus;
        if (status?.interviewLocation) this.Interviewlocation = status?.interviewLocation;
        this.scheduledDate = status?.serviceDate;
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

  selectMode(id: any, name: any): void {
    this.selectedModeId = id;
    this.selectedModeName = name;
  }

  selectRecruiter(recruiterid: any, firstname: any, secondName: any): void {
    this.showRecruiters = false;
    this.recruiterId = recruiterid;
    this.recruiterName = `${firstname} ${secondName}`;
  }

  selectPosition(id: any, name: any): void {
    this.showDropdown = false;
    this.positionId = id;
    this.positionName = name;
    this.fetchUsers();
    this.fetchCandidates();
    this.fetchPanel();
  }

  selectCandidate(candidateId: any, candidateFirstName: any, candidateLastName: any, candidate: any): void {
    this.showcandidate = false;
    this.candidateId = candidateId;
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

  selectPanel(panelid: any, firstname: any, secondName: any): void {
    this.showPanel = false;
    this.panelId = panelid;
    this.panelName = `${firstname} ${secondName}`;
  }

  dateChange(event: any): void {
    let date = new Date(event?.value);
    this.displayDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    if (this.interviewStatus === 'scheduled') this.interviewStatus = 'Rescheduled';
    this.changeInterviewStatus();
  }

  changeInterviewStatus(): void {
    if (this.displayDate && this.displayTime) {
      if (!this.interviewStatus) this.interviewStatus = 'Scheduled';
      if (this.interviewStatus === 'Not yet Schedule') this.interviewStatus = 'scheduled';
    }
  }

  timeChange(event: any): void {
    this.displayTime = event;
    if (this.interviewStatus === 'scheduled') this.interviewStatus = 'Rescheduled'
    this.changeInterviewStatus();
  }

  submit(): void {
    this.loader =true;
    const noticeperiod = document.getElementById('noticePeriod') as HTMLInputElement;
    this.noticeperiodvalue = noticeperiod?.value ? noticeperiod?.value : this.noticeperiodvalue;
    const comments = document.getElementById('comments') as HTMLInputElement;
    this.commentValue = comments.value ? comments.value : this.comment;
    const location = document.getElementById('location') as HTMLInputElement;
    this.locationValue = location.value ? location.value : this.Interviewlocation;
    if (this.displayDate && this.displayDate) this.displaydateTime = `${this.displayDate} ${this.displayTime}`;
    if (this.scheduledDate) this.displaydateTime = this.scheduledDate;
    const payload = {
      recruiterId: this.recruiterId,
      candidateId: this.candidateId,
      noticePeriod: this.noticeperiodvalue,
      position: this.positionId,
      location: this.locationValue,
      interviewTime: this.displaydateTime,
      interViewPanel: this.panelId,
      interviewMode: this.selectedModeName,
      serviceId: this.serviceId ? this.serviceId : '',
      interviewStatus: this.interviewStatus,
      rescheduleStatus: this.rescheduledStatusValue,
      comments: this.commentValue
    }
    console.log("payload",payload);
    if (this.noticeperiodvalue && this.commentValue && this.locationValue && this.recruiterId && this.candidateId && this.positionId && this.displaydateTime && this.panelId && this.selectedModeName  && this.interviewStatus  && this.commentValue) {
      this.apiService.post(`/screening-station/interview-details`, payload).subscribe({
        next: (res: any) => {
          this.loader = false;
          this.tostr.success('Interview Scheduled Successfully');
          this.resetFormAndState();
        },
        error: (error) => {
          this.loader = false;
          if (error?.status === 500) this.tostr.error("Internal Server Error");
          else this.tostr.warning("Unable to update");
        }
      })
    } else this.tostr.warning('Please check all the fields are valid');
    
  }

  clearInputvalue(id: string) {
    const inputElement = document.getElementById(id) as HTMLInputElement;
    if (inputElement) inputElement.value = '';
  }

  resetFormAndState(): void {
    this.panelName = null;
    this.recruiterName = null;
    this.positionName = null;
    this.displayDate = null;
    this.panelName = null;
    this.candidateExperience = null;
    this.currentCompany = null;
    this.showRecruiters = false;
    this.showDropdown = false;
    this.showPanel = false;
    this.candidateName = null;
    this.scheduledDate = null;
    this.modeValue = null;
    this.locationValue = '';
    this.noticeperiodvalue = '';
    this.commentValue = null;
    this.comment = '';
    this.displayTime = '';

    this.clearInputvalue('location');
    this.clearInputvalue('mode');
    this.clearInputvalue('interviewStatus');
    this.clearInputvalue('candidateStatus');
    this.clearInputvalue('rescheduledStatus');
    this.clearInputvalue('comments');
    this.candidate_list = [];
  }

  cancel(): void {
    this.resetFormAndState();
  }

}
