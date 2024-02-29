import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { ToastrServices } from 'src/app/services/toastr.service';
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
  noticePeriod: any;
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
  constructor(private datePipe: DatePipe, private cdr: ChangeDetectorRef, private http: HttpClient, private el: ElementRef,
    private tostr: ToastrServices) {
  }
  ngOnInit(): void {
    this.today = new Date();
  }

  @HostListener('document:click', ['$event'])
  onBodyClick(event: Event): void {
    const clickedElement = event.target as HTMLElement;
    if (!this.recruiterNameDiv.nativeElement.contains(clickedElement)) {
      this.showRecruiters = false;
    }
    if (!this.positionDiv.nativeElement.contains(clickedElement)) {
      this.showDropdown = false;
    }
    if (!this.candidatenameDiv.nativeElement.contains(clickedElement)) {
      this.showcandidate = false;
    }
    if (!this.panelDiv.nativeElement.contains(clickedElement)) {
      this.showPanel = false;
    }
  }
  fetchCandidates() {
    if (this.positionId) {
      this.http.get(`${environment.api_url}/screening-station/interview-details/candidates-list?serviceRequestId=${this.positionId}&search=`).subscribe((res: any) => {
        this.candidate_list = res.candidates;
        console.log("res", this.candidate_list);
      })
    } else {
      this.tostr.warning("Make sure to select the position dropdown first");
    }

  }
  fetchUsers(): void {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEyLCJ1c2VyVHlwZSI6ImFkbWluIiwidXNlckVtYWlsIjoiYWRtaW5AbWFpbGluYXRvci5jb20ifQ.Uva57Y4MMA0yWz-BYcRD-5Zzth132GMGJkFVQA3Tn50'
    });
    this.http.get(`${environment.api_url}/user/lists`, { headers }).subscribe((res: any) => {
      this.users_list = res.users;
    })
  }
  fetchPosition(): void {
    this.http.get(`${environment.api_url}/service-request/list`).subscribe((res: any) => {
      this.positionList = res.data;
      console.log("this.positionList", this.positionList);

    })
  }
  fetchPanel(): void {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEyLCJ1c2VyVHlwZSI6ImFkbWluIiwidXNlckVtYWlsIjoiYWRtaW5AbWFpbGluYXRvci5jb20ifQ.Uva57Y4MMA0yWz-BYcRD-5Zzth132GMGJkFVQA3Tn50'
    });
    this.http.get(`${environment.api_url}/user/lists`, { headers }).subscribe((res: any) => {
      this.panel_list = res.users;
    })
  }
  fetchCandidatesDetails(): void {
    this.http.get(`${environment.api_url}/screening-station/interview-details/candidate-detail?candidateId=${this.candidateId}`).subscribe((res: any) => {
      console.log("candidate details", res);
      this.candidateDetails = res.candidate;
      this.candidateStatus = res.candidateStatus;
      this.candidateDetails.forEach((candidate: any) => {
        this.candidateExperience = candidate.candidateExperience;
        this.currentCompany = candidate.candidatePreviousOrg;
        this.id = candidate.candidateId;
        if (candidate.candidateNoticePeriodByDays) this.noticePeriod = candidate.candidateNoticePeriodByDays;
      })
      this.candidateStatus.forEach((status: any) => {
        this.serviceId = status.serviceId;
        if (status.interviewMode) this.interviewMode = status.interviewMode;
        console.log("this.interviewMode", this.interviewMode);
        if (status.comment) this.comment = status.comment;
        console.log("this.comment", this.comment);
        if (status.interviewStatus) this.interviewStatus = status.interviewStatus;
        if (status.interviewLocation) this.Interviewlocation = status.interviewLocation;
        console.log("this.Interviewlocation", this.Interviewlocation);
        this.scheduledDate = status.serviceDate;
      })
    })
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
  }
  selectCandidate(candidateId: any, candidateFirstName: any, candidateLastName: any, candidate: any): void {
    this.showcandidate = false;
    this.candidateId = candidateId;
    this.candidateName = `${candidateFirstName} ${candidateLastName}`;
    this.selectedCandidate = candidate;
    console.log("selectCandidate", this.selectedCandidate);
    if (this.selectedCandidate) {
      this.fetchCandidatesDetails();
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
    console.log("this.displayDate", this.displayDate);
    if (this.interviewStatus === 'scheduled') this.interviewStatus = 'Rescheduled';
    this.changeInterviewStatus();
  }
  changeInterviewStatus(): void {
    if (this.displayDate && this.displayTime) {
      if (!this.interviewStatus) this.interviewStatus = 'Scheduled';
    }
  }
  timeChange(event: any): void {
    console.log("event", event);
    this.displayTime = event;
    console.log(this.displayTime);
    
    if (this.interviewStatus === 'scheduled') this.interviewStatus = 'Rescheduled'
    this.changeInterviewStatus();
  }
  submit(): void {
    const noticeperiod = document.getElementById('noticePeriod') as HTMLInputElement;
    this.noticeperiodvalue = noticeperiod.value;
    console.log("this.noticeperiodvalue ", this.noticeperiodvalue);
    const comments = document.getElementById('comments') as HTMLInputElement;
    this.commentValue = comments.value ? comments.value : this.comment;
    console.log("this.commentValue", this.commentValue);
    const mode = document.getElementById('mode') as HTMLInputElement;
    this.modeValue = mode.value ? mode.value : this.interviewMode;
    const location = document.getElementById('location') as HTMLInputElement;
    this.locationValue = location.value ? location.value : this.Interviewlocation;
    console.log(" this.locationValue", this.locationValue);
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
      interviewMode: this.modeValue,
      serviceId: this.serviceId ? this.serviceId : '',
      interviewStatus: this.interviewStatus,
      rescheduleStatus: this.rescheduledStatusValue,
      comments: this.commentValue
    }

    console.log("payload", payload);
    this.http.post(`${environment.api_url}/screening-station/interview-details`, payload).subscribe({
      next: (res: any) => {
        this.tostr.success('Interview Scheduled Successfully');
        this.resetFormAndState();
      },
      error: (error) => {
        if (error?.status === 500) this.tostr.error("Internal Server Error");
        else {
          this.tostr.warning("Unable to update");
        }
      }
    })
  }
  clearInputvalue(id: string) {
    const inputElement = document.getElementById(id) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
  }
  resetFormAndState(): void {
    this.panelName = null;
    this.recruiterName = null;
    this.positionName = null;
    this.displayDate = null;
    this.panelName = null;
    this.candidateExperience = null;
    this.noticePeriod = null;
    this.currentCompany = null;
    this.showRecruiters = false;
    this.showDropdown = false;
    this.showPanel = false;
    this.candidateName = null;
    this.scheduledDate = null;
    this.noticeperiodvalue = null;
    this.modeValue = null;
    this.locationValue = '';
    this.noticeperiodvalue = '';
    this.commentValue = null;
    this.comment = '';
    
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
