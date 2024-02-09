import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environments';
import { ApprovalStatusService } from 'src/app/services/approval-status.service';
@Component({
  selector: 'app-requirement-form',
  templateUrl: './requirement-form.component.html',
  styleUrls: ['./requirement-form.component.css'],
  providers: [DatePipe],
})
export class RequirementFormComponent implements OnInit {
  @ViewChild('stationInput') stationInput!: ElementRef<HTMLInputElement>;
  @ViewChild('serviceAssignee') serviceAssignee!: ElementRef<HTMLInputElement>;
  @ViewChild('serviceDate') serviceDate!: ElementRef<HTMLInputElement>;
  requestList_open: boolean = false;
  serviceList_open: boolean = false;
  experienceList_open: boolean = false;
  experience_droplist: any = [];
  list_experience: any = [];
  list_requests: any = [];
  list_services: any = [];
  list_skills: any = [];
  selectedId: any;
  selectedName: any;
  selectedServiceId: any;
  selectedServiceName: any;
  selectedExperience: any;
  selectedExperienceId: any;
  candidates_experience: any = [];
  candidates: any = [];
  candidateSelectAllStatus: boolean = false;
  selectedCandidateId: any = [];
  displayDate: any;
  isSelectedFresher: any = 0;
  isChecked: boolean = false;
  constructor(private http: HttpClient, private datePipe: DatePipe) { }
  ngOnInit(): void {
    this.fetchServiceRequestname();
    this.fetchServiceId();
   
    this.fetchSkills();

    this.fetchcandidatesWithSkills();

  }

  fetchServiceRequestname(): void {
    this.http.get(`${environment.api_url}/service-request/list`).subscribe((res: any) => {
this.list_requests = res.data;
      console.log(" this.list_requests", this.list_requests);
     })
  }

  fetchServiceId(): void {
    this.http.get(`${environment.api_url}/service-request/services`).subscribe((res: any) => {

      this.list_services = res.data;
    })
  }

  fetchcandidatesWithExperience(): void {
    console.log("this.selectedExperience", this.selectedExperience);

    this.http.get(`${environment.api_url}/service-request/candidates/list?exprience=${this.selectedExperience}`).subscribe((res: any) => {

      this.list_experience = res.candidates;


    })
  }
  fetchSkills(): void {
    this.http.get(`${environment.api_url}/candidate/skills/list`).subscribe((res: any) => {

      this.list_skills = res.data;
      console.log("this.list_skills", this.list_skills);

    })
  }

  fetchcandidatesWithSkills(): void {
    this.http.get(`${environment.api_url}/service-request/candidates/list?skill=${this.selectedId}`).subscribe((res) => {

      console.log("fetchcandidatesWithSkills", res);

    })
  }

  fetchExperience(): void {
    this.http.get(`${environment.api_url}/service-request/exp-year/list`).subscribe((res: any) => {


      this.experience_droplist = res.data;
    })
  }

  selectRequestId(name: any, id: any): void {
    this.requestList_open = false;
    if (this.selectedName !== name && this.selectedId !== id) {
      this.selectedName = name;
      this.selectedId = id;
    }
    // this.requestList_open = true;
  }

  selectServiceId(id: any, name: any): void {


    this.serviceList_open = false;
    if (this.selectedServiceId !== id && this.selectedServiceName !== name) {
      this.selectedServiceId = id;
      console.log(" this.selectedServiceId ", this.selectedServiceId);

      this.selectedServiceName = name;



    }
    this.serviceList_open = true;
  }

  selectExperience(experience: any): void {
    this.experienceList_open = false;
    if (this.selectedExperience !== experience) {
      this.selectedExperience = experience;
      this.fetchcandidatesWithExperience();
      // console.log(" this.selectedExperience", this.selectedExperience);

    }
   
  }

  // fetchCandidates(): void {
  //   this.http.get(`${environment.api_url}/service-request/candidates/list`).subscribe((res: any) => {
  //     this.candidates = res?.candidates;
  //     console.log("this.candidates", this.candidates);
  //   })
  // }
  selectAllChange(event: any): void {
    this.selectedCandidateId = [];
    this.candidates.forEach((element: any) => {
      if (event?.target?.checked) {
        element.checked = true;
        this.selectedCandidateId.push(element.candidateId);
      } else {
        element.checked = false;
      }
    });
    // console.log("selectedCandidateId",this.selectedCandidateId);

  }
  candidateSelectChange(event: any, item: any): void {
    console.log("select ", item);
    this.selectedCandidateId.push(item.candidateId)
    // if (event?.target?.checked) {
    //   this.selectedCandidateId.push(item.candidateId)
    // } 
    // else {
    //   this.selectedCandidateId.forEach((element:any, i:any) => {
    //     if (element?.id === item?.id) this.selectedCandidateId.splice(i, 1);
    //   });
    // }
    console.log(" this.selectedCandidateId", this.selectedCandidateId);

  }

  selectSkills(): void {

  }
  onClick(): void {
    this.isChecked = !this.isChecked;
  }
  sumitClick() {
    const requestData = {
      // serviceStation: this.stationInput.nativeElement.value,
      serviceServiceRequst: this.selectedId,
      // serviceServiceId: this.selectedServiceId,
      serviceCandidates: this.selectedCandidateId,
      serviceAssignee: null,
      serviceDate: this.displayDate
    };
    console.log("requestData", requestData);


    this.http.post(`${environment.api_url}/screening-station/create`, requestData).subscribe((res: any) => {
      // console.log("posted successfully",res);
      alert("Submitted Successfully");
    })
  }

  dateChange(event: any): void {
    let date = new Date(event?.value);
    this.displayDate = this.datePipe.transform(date, 'yyyy-MM-dd');


  }
}
