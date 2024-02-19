import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';
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
  locationValue: any;
  panelId: any;
  panelName: any;
  panel_list: any;
  modeValue: any;
  interviewStatusValue: any;
  candidateStatusValue: any;
  rescheduledStatusValue: any;
  commentValue: any;
  selectedCandidate: any[] = [];

  constructor(private datePipe: DatePipe, private cdr: ChangeDetectorRef, private http: HttpClient, private el: ElementRef) {

  }
  ngOnInit(): void {
    
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
    this.http.get(`${environment.api_url}/service-request/candidates/list`).subscribe((res: any) => {
      this.candidate_list = res.candidates;
    })
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
    this.http.get(`${environment.api_url}/service-request/services`).subscribe((res: any) => {
      this.positionList = res.data;
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
      this.candidateExperience = candidate.candidateExperience;
      this.noticePeriod = '30';
      this.currentCompany = candidate.candidatePreviousDesignation;
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
  }
  timeChange(event: any): void {
    console.log("event", event);
    this.displayTime = event;
  }
  submit(): void {
    const location = document.getElementById('location') as HTMLInputElement;
    this.locationValue = location ? location.value : '';
    const mode = document.getElementById('mode') as HTMLInputElement;
    this.modeValue = mode ? mode.value : '';
    const interviewStatus = document.getElementById('interviewStatus') as HTMLInputElement;
    this.interviewStatusValue = interviewStatus ? interviewStatus.value : '';
    const candidateStatus = document.getElementById('candidateStatus') as HTMLInputElement;
    this.candidateStatusValue = candidateStatus ? candidateStatus.value : '';
    const rescheduledStatus = document.getElementById('rescheduledStatus') as HTMLInputElement;
    this.rescheduledStatusValue = rescheduledStatus ? rescheduledStatus.value : '';
    const comments = document.getElementById('comments') as HTMLInputElement;
    this.commentValue = comments ? comments.value : '';
    if (this.displayDate && this.displayDate) this.displaydateTime = `${this.displayDate} ${this.displayTime}`;
    const payload = {
      recruiterId: this.recruiterId,
      candidateId: this.candidateId,
      noticePeriod: this.noticePeriod,
      currentCompany: this.currentCompany,
      location: this.locationValue,
      interviewTime: this.displaydateTime,
      interViewPanel: this.panelId,
      interviewMode: this.modeValue,
      interviewStatus: this.interviewStatusValue,
      candidateStatus: this.candidateStatusValue,
      rescheduleStatus: this.rescheduledStatusValue,
      comments: this.commentValue
    }
    console.log("payload", payload);
    this.http.post(`${environment.api_url}/screening-station/interview-details`, payload).subscribe({
      next: (res: any) => {
        alert('Interview Details Submitted');
      },
      error: (error) => {
        console.error('Error adding details', error);
      }
    })
  }
}
