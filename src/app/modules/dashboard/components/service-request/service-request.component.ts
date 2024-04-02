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
  selectedStations: any = [
    { stationName: "Screening", stationId: 1 },
    { stationName: "HR", stationId: 5 }
  ];
  searchvalue: any;
  skillSuggestions: any[] = [];
  showSearchBar: boolean = false;
  selectedSkills: any[] = [];
  skillNameValue: string = '';
  stationIdToRemove: any;
  constructor(private toastr: ToastrServices, private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchStations();
    this.fetchServiceTeam();
  }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.teamListOpen = false;
      this.idListOpen = false;
    }
  }

  fetchServiceId(): void {
    this.apiService.get(`/service-request/services`).subscribe(((res: any) => {
      if (res?.data) this.list_id = res?.data;
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
      if (res?.data)
        this.stationsList = res?.data.slice(1, -1);
    })
  }

  selectStation(id: any, stationName: any): void {
    this.idListOpen = false;
    if (!this.selectedStations.some((station: { stationId: any; }) => station.stationId === id)) {
      const hrManagerIndex = this.selectedStations.findIndex((station: { stationName: string; }) => station.stationName === 'HR Manager');
      this.selectedStations.splice(hrManagerIndex, 0, { stationName, stationId: id });
      this.stationsList = this.stationsList.filter((station: { stationId: any; }) => station.stationId !== id);
    }
  }

  deleteStation(stationId: any, stationName: any): void {
    if (stationId !== 1 && stationId !== 5) {
      this.selectedStations = this.selectedStations.filter((station: { stationId: any; }) => station.stationId !== stationId);
      this.stationsList.push({ stationId: stationId, stationName: stationName });
    }
  }

  getSkillSuggestions(event: any): void {
    this.showSearchBar = true;
    this.searchvalue = event?.target.value;
    this.apiService.get(`/candidate/skills/list?search=${this.searchvalue}`).subscribe((res: any) => {
      if (res?.data) this.skillSuggestions = res?.data.filter((suggestion: any) =>
        suggestion.skillName.toLowerCase().startsWith(this.searchvalue.toLowerCase())
      );
    });
  }

  selectSkill(suggestion: any): void {
    const selectedSkill = suggestion.skillName;
    this.selectedSkills.push(selectedSkill);
    this.showSearchBar = false;
    this.skillSuggestions = [];
  }

  removeSkill(skillToRemove: any): void {
    this.selectedSkills = this.selectedSkills?.filter(skill => skill.id !== skillToRemove.id);
  }

  submitClick(): void {
    const skillName = document.getElementById('skillSearch') as HTMLInputElement;
    this.skillNameValue = skillName.value;
    // this.skillsArray = this.skills.nativeElement.value.split(',').map(skill => skill.trim());
    const stationIds = this.selectedStations.map((station: { stationId: any; }) => station.stationId);
    const requestData = {
      requestServiceId: this.selectedId,
      requestName: this.serviceInput.nativeElement.value,
      requestTeam: this.selectedTeamName,
      requestExperience: this.experienceInput.nativeElement.value,
      requestBaseSalary: this.baseSalaryInput.nativeElement.value,
      requestMaxSalary: this.maxSalaryInput.nativeElement.value,
      requestSkills: this.selectedSkills.length > 0 ? this.selectedSkills : [this.skillNameValue],
      requestVacancy: this.vacancy.nativeElement.value,
      requestFlowStations: stationIds
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
    this.selectedTeam = null;
    this.clearInputvalue(this.experienceInput);
    this.clearInputvalue(this.serviceInput);
    this.clearInputvalue(this.baseSalaryInput);
    this.clearInputvalue(this.maxSalaryInput);
    // this.clearInputvalue(this.skills);
    this.clearInputvalue(this.vacancy);
    this.idListOpen = false;
    this.teamListOpen = false;
    this.selectedSkills = [];
    this.selectedStations = [];
  }



  cancel(): void {
    this.resetFormAndState();
  }

}
