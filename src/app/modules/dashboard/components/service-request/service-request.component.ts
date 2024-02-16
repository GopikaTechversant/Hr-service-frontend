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
  @ViewChild('vacancy') vacancy!: ElementRef<HTMLInputElement>;
  list_id: any = [];
  list_team: any = [];
  idListOpen: boolean = false;
  selectedId: any;
  selectedName: any;
  selectedTeam: any;
  selectedTeamName: any;
  teamListOpen: boolean = false;
  skillsArray: any = [];
  requestVacancy: any;
  stationsList: any[] = [];
  stationId: any;
  stationName: any;
  selectedstations: any[] = [];
  selectedStationsId: any[] = [];
  constructor(private http: HttpClient) {

  }
  ngOnInit(): void {
    
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
  fetchStations(): void {
    this.http.get(`${environment.api_url}/user/stations`).subscribe((res: any) => {
      this.stationsList = res.data;
    })
  }
  selectStation(stationid: any, stationName: any): void {
    this.idListOpen = false;
    this.stationId = stationid;
    if (!this.selectedStationsId.includes(stationid)) this.selectedStationsId.push(stationid);
    if (!this.selectedstations.includes(stationName)) this.selectedstations.push(stationName);
    this.stationName = this.selectedstations.join(',');
    const screeningStation = this.stationsList.find((station: any) => station.stationName == 'Screening');
    const hrStation = this.stationsList.find((station: any) => station.stationName == 'Hiring Manager');
    if (screeningStation && !this.selectedStationsId.includes(screeningStation.stationId)) this.selectedStationsId.push(screeningStation.stationId);
    if (hrStation && !this.selectedStationsId.includes(hrStation.stationId)) this.selectedStationsId.push(hrStation.stationId);
    console.log("this.selectedStationsId", this.selectedStationsId);
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
      requestVacancy: this.vacancy.nativeElement.value,
      requestFlowStations: this.selectedStationsId
    };
    this.http.post(`${environment.api_url}/service-request/create`, requestData).subscribe((res) => {
      alert("Submitted Successfully")
    })
  }
}
