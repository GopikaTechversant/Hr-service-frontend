import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ViewChild, ElementRef } from '@angular/core';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-service-request',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.css']
})
export class ServiceRequestComponent implements OnInit {
  @ViewChild('serviceInput') serviceInput!: ElementRef<HTMLInputElement>;
  @ViewChild('experienceInput') experienceInput!: ElementRef<HTMLInputElement>;
  @ViewChild('baseSalaryInput') baseSalaryInput!: ElementRef<HTMLInputElement>;
  @ViewChild('maxSalaryInput') maxSalaryInput!: ElementRef<HTMLInputElement>;
  @ViewChild('skills') skills!: ElementRef<HTMLInputElement>;
  list_id: any = [];
  list_team: any = [];
  idListOpen: boolean = false;
  selectedId: any;
  selectedName: any;
  selectedTeam: any;
  selectedTeamName: any;
  teamListOpen: boolean = false;
  skillsArray: any = [];
  constructor(private http: HttpClient) {

  }
  ngOnInit(): void {
    this.fetchServiceId();
    this.fetchServiceTeam();
  }
  fetchServiceId(): void {
    this.http.get(`${environment.api_url}/service-request/services`).subscribe(((res: any) => {
      this.list_id = res.data;
    }))
  }
  selectId(id: any, name: any): void {
    this.idListOpen = false;
    if (this.selectedId !== id) {
      this.selectedId = id;
      this.selectedName = name;
    }
    this.idListOpen = true;
  }

  fetchServiceTeam(): void {
    this.http.get(`${environment.api_url}/service-request/team`).subscribe((res: any) => {
      this.list_team = res.data;
    })
  }

  selectTeam(teamId: any, teamName: any): void {
    this.teamListOpen = false;
    if (this.selectedTeam !== teamName) {
      this.selectedTeam = teamName;
      this.selectedTeamName = teamId;
    }
    this.teamListOpen = true;
  }

  sumitClick(): void {
    this.skillsArray = this.skills.nativeElement.value.split(',').map(skill => skill.trim());
    const requestData = {
      requestServiceId: this.selectedId,
      requestName: this.serviceInput.nativeElement.value,
      requestTeam: this.selectedTeamName,
      requestExperience: this.experienceInput.nativeElement.value,
      requestBaseSalary: this.baseSalaryInput.nativeElement.value,
      requestMaxSalary: this.maxSalaryInput.nativeElement.value,
      requestSkills: this.skillsArray,
    };
    this.http.post(`${environment.api_url}/service-request/create`, requestData).subscribe((res) => {
      // console.log("requirement post",res);
      alert("Submitted Successfully")
    })
  }
}
