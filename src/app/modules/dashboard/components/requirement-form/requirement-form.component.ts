import { Component ,OnInit} from '@angular/core';
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
export class RequirementFormComponent implements OnInit{
  @ViewChild('stationInput') stationInput!: ElementRef<HTMLInputElement>;
  @ViewChild('serviceAssignee') serviceAssignee!: ElementRef<HTMLInputElement>;
  @ViewChild('serviceDate') serviceDate!: ElementRef<HTMLInputElement>;
  requestList_open: boolean = false;
  serviceList_open: boolean = false;
  experienceList_open: boolean = false;
  experience_droplist: any = [];
  list_experience: any = [];
  list_requests:any = [];
  list_services:any = [];
  list_skills:any = [];
  selectedId: any;
  selectedName:any;
  selectedServiceId: any;
  selectedServiceName: any;
  selectedExperience: any;
  selectedExperienceId: any;
  candidates_experience:any = [];
  candidates:any = [];
  candidateSelectAllStatus: boolean = false;
  selectedCandidateId :any = [];
  displayDate: any;
  isSelectedFresher : any = 0;
  
  constructor(private http: HttpClient,private datePipe: DatePipe){}
  ngOnInit(): void {
    this.fetchServiceRequestname();
    this.fetchServiceId();
    this.fetchCandidates();
    this.fetchExperience();
    this.fetchSkills()
    this.fetchcandidatesWithExperience();
    this.fetchcandidatesWithSkills();
   
}

fetchServiceRequestname():void{
  this.http.get(`${environment.api_url}/service-request/list`).subscribe((res:any) => {
    // console.log("response fetchServiceRequestname",res);
    this.list_requests = res.data;
    // console.log("list_requests", this.list_requests);
    
    
  })
}

fetchServiceId():void{
  this.http.get(`${environment.api_url}/service-request/services`).subscribe((res:any) =>{
    // console.log("fetchServiceId",res);
    this.list_services = res.data;
  })
}

fetchcandidatesWithExperience():void{
  this.http.get(`${environment.api_url}/service-request/candidates/list?exprience=${this.selectedExperience}`).subscribe((res:any) =>{
    // console.log("experience",res);
    this.list_experience = res.candidates;
    // console.log(" this.list_experience ", this.list_experience );
    
})
}
 fetchSkills():void{
  this.http.get(`${environment.api_url}/candidate/skills/list`).subscribe((res:any) =>{
    // console.log("skills",res);
    this.list_skills = res.data;
  })
 }

fetchcandidatesWithSkills():void{
  this.http.get(`${environment.api_url}/service-request/candidates/list?skill=${this.selectedId}`).subscribe((res) =>{
    // console.log("candidates with skills",res);
    
  })
}

fetchExperience():void{
  this.http.get(`${environment.api_url}/service-request/exp-year/list`).subscribe((res:any) =>{
  // console.log("experince dropdown",res);
  
  this.experience_droplist = res.data;
  })
}



// selectRequestId(name:any):void{
//   // console.log("qqqq", name);
//   let id = name.requestId;
//   let serviceName = name["team.teamName"];
//   this.requestList_open = false;
//   // console.log(this.selectedId , this.selectedName);
//     if(this.selectedId !== id && this.selectedName !== serviceName){
   
    
//     this.selectedId = id;
//     this.selectedName = serviceName;
//     console.log(" this.selectedName", this.selectedId);
    
//   }
//   this.requestList_open = true;
// }

selectRequestId(name:any,id:any):void{
  this.requestList_open = false;
  if(this.selectedName !== name && this.selectedId !== id){
    this.selectedName = name;
    this.selectedId = id;
  }
  this.requestList_open = true;
}

selectServiceId(id:any,name:any):void{
  // console.log("qqqq");
  
  this.serviceList_open = false;
  if(this.selectedServiceId !== id && this.selectedServiceName !== name){
    this.selectedServiceId  = id;
    this.selectedServiceName = name;
    // console.log("selectedServiceId ",this.selectedServiceId );
    // console.log("selectedServiceName ",this.selectedServiceName );
    // console.log("this.selectedServiceName",typeof(this.selectedServiceName));
    
    
  }
  this.serviceList_open = true;
}

selectExperience(experience:any):void{
  this.experienceList_open = false;
  if( this.selectedExperience !== experience){
    this.selectedExperience = experience; 
   
    // console.log(" this.selectedExperience", this.selectedExperience);
    
  }
  this.experienceList_open = true;
}

fetchCandidates():void{
  this.http.get(`${environment.api_url}/service-request/candidates/list`).subscribe((res:any) =>{
  // console.log("res req",res);
  
  this.candidates_experience = res?.candidates;
  this.candidates = res?.candidates;
   
  // console.log("this.candidates",this.candidates);
  
  
  })
}
selectAllChange(event:any): void {
  this.selectedCandidateId = [];
  this.candidates.forEach((element:any) => {
    if (event?.target?.checked) {
      element.checked = true;
      this.selectedCandidateId.push(element.candidateId);
    } else {
      element.checked = false;
    }
  });
  // console.log("selectedCandidateId",this.selectedCandidateId);
  
}
candidateSelectChange(event:any, item:any): void {
  if (event?.target?.checked) {
    this.selectedCandidateId.push(item.candidateId)
  } 
  else {
    this.selectedCandidateId.forEach((element:any, i:any) => {
      if (element?.id === item?.id) this.selectedCandidateId.splice(i, 1);
    });
  }
  // console.log(" this.selectedCandidateId", this.selectedCandidateId);
  
}

selectSkills():void{

}

sumitClick(){
  const requestData = {
    // serviceStation: this.stationInput.nativeElement.value,
    serviceServiceRequst: this.selectedId,
    serviceServiceId: this.selectedServiceId,
    serviceCandidates: this.selectedCandidateId,
    serviceAssignee: null,
    serviceDate: this.displayDate
  };
//  console.log("requestData",requestData);
 
  
  this.http.post(`${environment.api_url}/screening-station/create`,requestData).subscribe((res:any) => {
    // console.log("posted successfully",res);
    
  })
}

dateChange(event:any): void {
  let date = new Date(event?.value);
  this.displayDate = this.datePipe.transform(date, 'yyyy-MM-dd');
  
  
}
}
