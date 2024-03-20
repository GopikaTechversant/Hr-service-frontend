import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { ToastrServices } from 'src/app/services/toastr.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-service-request',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.css'],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
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
  constructor(private toastr: ToastrServices, private apiService: ApiService) { }

  ngOnInit(): void { }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.teamListOpen = false;
      this.idListOpen = false;
    }
  }

  fetchServiceId(): void {
    this.apiService.get(`/service-request/services`).subscribe(((res: any) => {
      this.list_id = res?.data;
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
    this.apiService.get(`/service-request/team`).subscribe((res: any) => {
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
    this.apiService.get(`/user/stations`).subscribe((res: any) => {
      this.stationsList = res.data;
      const array = this.stationsList.slice(1, -1);
    })
  }

  selectStation(stationid: any, stationName: any): void {
    this.idListOpen = false;
    this.stationId = stationid;
    if (!this.selectedStationsId.includes(stationid)) this.selectedStationsId.push(stationid);
    if (!this.selectedstations.includes(stationName)) this.selectedstations.push(stationName);
    this.stationName = this.selectedstations.join(' -> ');
    const screeningStation = this.stationsList.find((station: any) => station.stationName == 'Screening');
    const hrStation = this.stationsList.find((station: any) => station.stationName == 'Hiring Manager');
    if (screeningStation && !this.selectedStationsId.includes(screeningStation.stationId)) this.selectedStationsId.push(screeningStation.stationId);
    if (hrStation && !this.selectedStationsId.includes(hrStation.stationId)) this.selectedStationsId.push(hrStation.stationId);
  }

  submitClick(): void {
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
    this.apiService.post(`/service-request/create`, requestData).subscribe((res) => {
      this.toastr.success("Requirement created Successfully");
      this.resetFormAndState();
    }, (err) => {
      if (err?.status === 500) this.toastr.error("Internal Server Error")
      else {
        this.toastr.warning(err?.message ? err?.message : "Unable to create requirement");
      }
    })
  }

  clearInputvalue(inputElement: ElementRef<HTMLInputElement>) {
    inputElement.nativeElement.value = '';
  }

  resetFormAndState(): void {
    this.stationsList = [];
    this.stationName = null;
    this.selectedTeam = null;
    this.clearInputvalue(this.experienceInput);
    this.clearInputvalue(this.serviceInput);
    this.clearInputvalue(this.baseSalaryInput);
    this.clearInputvalue(this.maxSalaryInput);
    this.clearInputvalue(this.skills);
    this.clearInputvalue(this.vacancy);
    this.idListOpen = false;
    this.teamListOpen = false;
  }

  cancel(): void {
    this.resetFormAndState();
  }

}
