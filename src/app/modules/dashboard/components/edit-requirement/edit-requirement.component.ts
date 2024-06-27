import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { ToastrServices } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-edit-requirement',
  templateUrl: './edit-requirement.component.html',
  styleUrls: ['./edit-requirement.component.css']
})
export class EditRequirementComponent implements OnInit {
  public onEditSuccess: EventEmitter<void> = new EventEmitter<void>();

  selectedStations: any = [
    { stationName: "Screening", stationId: 1 },
    { stationName: "HR", stationId: 5 }
  ];
  stationsList: any[] = [];
  idListOpen: boolean = false;
  stationsLists: any;
  showSearchBar: boolean = false;
  searchvalue: string = "";
  skillSuggestions: any[] = [];
  selectedSkills: any[] = [];
  loader: boolean = false;
  list_team: any[] = [];
  teamListOpen: boolean = false;
  openDesignation: boolean = false;
  designationList: any;
  // Initial values
  initialJobTitle: string = '';
  initialJobCode: string = '';
  initialExperience: string = '';
  initialBaseSalary: string = '';
  initialMaxSalary: string = '';
  initialVacancy: string = '';
  initialSkills: string[] = [];
  initialTeam: string = '';
  initialTeamName: any;
  initialDesignation: string = '';
  initialDesignationId: any;
  // Current values
  jobTitle: string = '';
  jobCode: string = '';
  experience: string = '';
  baseSalary: string = '';
  maxSalary: string = '';
  vacancy: string = '';
  skills: string[] = [];
  selectedTeam: string = '';
  selectedTeamName: any;
  selectedDesignation: string = '';
  selectedDesignationId: any;
  initialValues: any = {};
  requirement_details: any = {};
  flows: any[] = [];
  constructor(public dialogRef: MatDialogRef<EditRequirementComponent>, private tostr: ToastrServices, private apiService: ApiService,
    private datePipe: DatePipe, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.fetchDetails();
    this.fetchStations();
    this.fetchServiceTeam();
    this.fetchDesignation();
  }

  initializeDataValues(): void {
    this.jobTitle = this.requirement_details.requestName || '';
    this.jobCode = this.requirement_details.requestCode || '';
    this.experience = this.requirement_details.requestMaximumExperience || '';
    this.baseSalary = this.requirement_details.requestBaseSalary || '';
    this.maxSalary = this.requirement_details.requestMaxSalary || '';
    this.vacancy = this.requirement_details.requestVacancy || '';
    this.selectedSkills = this.requirement_details.requestSkills ? this.requirement_details.requestSkills.split(',') : [];
    this.selectedTeam = this.requirement_details.team.teamName || '';
    this.selectedDesignation = this.requirement_details.designationName || '';
    if (this.flows) {
      this.selectedStations = this.flows.map((flow: any) => ({
        stationId: flow.flowStationId,
        stationName: flow.flowStationName
      }));
    } else this.selectedStations = [];
  }

  fetchDetails(): void {
    this.apiService.get(`/service-request/view?requestId=${this.data}`).subscribe((res: any) => {
      this.requirement_details = res?.data;
      this.flows = res?.flows;
      this.initializeDataValues();
    })
  }

  fetchStations(): void {
    this.apiService.get(`/user/stations`).subscribe((res: any) => {
      if (res?.data) {
        this.stationsLists = res?.data;
        this.stationsList = [
          { "stationName": "Written", "stationId": 2 },
          { "stationName": "Technical", "stationId": 6 }
        ];
      }
    })
  }

  fetchServiceTeam(): void {
    this.apiService.get(`/service-request/team`).subscribe((res: any) => {
      this.list_team = res.data;
    })
  }

  fetchDesignation() {
    this.apiService.get(`/service-request/designation/list`).subscribe(((res: any) => {
      if (res?.data) this.designationList = res?.data;
    }))
  }

  selectStation(id: any, stationName: any): void {
    if (stationName !== "Technical") {
      if (!this.selectedStations.some((station: { stationId: any; }) => station.stationId === id)) {
        const hrManagerIndex = this.selectedStations.findIndex((station: { stationName: string; }) => station.stationName === 'HR Manager');
        this.selectedStations.splice(hrManagerIndex, 0, { stationName, stationId: id });
        this.stationsList = this.stationsList.filter((station: { stationId: any; }) => station.stationId !== id);
        this.idListOpen = false;
      }
    }
    // if (stationName === "Written" || stationName === "Technical") this.stationsList = this.stationsLists.slice(2, -1)
    if (stationName === "Written" || stationName === "Technical") this.stationsList = this.stationsLists.slice(2, -2)
    else if (stationName === "Technical 2") this.stationsList = this.stationsList.filter(station => station.stationName !== "Technical 1");
  }

  deleteStation(stationId: any, stationName: any): void {
    if (stationId !== 1 && stationId !== 5) {
      this.selectedStations = this.selectedStations.filter((station: { stationId: any; }) => station.stationId !== stationId);
      this.stationsList.push({ stationId: stationId, stationName: stationName });
    }
    this.fetchStations();
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
    this.selectedSkills = this.selectedSkills?.filter(skill => skill !== skillToRemove);
  }

  submitClick(): void {
    const payload: any = {
      requestId: this.data
    };
    if (this.jobTitle !== this.requirement_details.requestName) payload.requestName = this.jobTitle;
    if (this.jobCode !== this.requirement_details.requestCode) payload.requestCode = this.jobCode;
    if (this.vacancy !== this.requirement_details.requestVacancy) payload.requestVacancy = this.vacancy;
    if (this.skills !== this.requirement_details.requestSkills) payload.requestSkills = this.selectedSkills;
    if (this.selectedStations !== this.flows) payload.requestFlowStations = this.selectedStations.map((station: any) => station.stationId);
    if (this.experience !== this.requirement_details.requestMaximumExperience) payload.requestMaximumExperience = this.experience;
    if (this.selectedDesignation !== this.requirement_details.designationName) payload.requestDesignation = this.selectedDesignationId;
    if (this.baseSalary !== this.requirement_details.requestBaseSalary) payload.requestBaseSalary = this.baseSalary;
    if (this.maxSalary !== this.requirement_details.requestMaxSalary) payload.requestMaxSalary = this.maxSalary;
    if (this.selectedTeam !== this.requirement_details.team.teamName) payload.requestTeam = this.selectedTeamName;
    if (this.jobTitle && this.jobCode && this.vacancy && this.skills && this.selectedStations && this.experience && this.selectedDesignation && this.baseSalary && this.maxSalary && this.selectedTeam) {
      this.apiService.post('/service-request/edit', payload).subscribe(response => {
        this.tostr.success('Requirement updated successfully');
        this.onEditSuccess.emit();
        this.dialogRef.close(response);
      }, error => {
        this.tostr.error('Failed to update requirement');
      });
    } else this.tostr.warning('Please fill all mandatory fields');
  }

  cancel(): void {
    this.dialogRef.close();
  }

  onKeypress(event: any): void {
    let enteredValue: string;
    if (event.key === "Backspace") enteredValue = event?.target?.value.slice(0, -1);
    else enteredValue = event.target.value + event.key;
    const allowedCharacters: RegExp = /^[0-9]+$/;
    if (event.key !== "Backspace" && !allowedCharacters.test(enteredValue)) {
      event.preventDefault();
      return;
    }
  }

  onPaste(event: any): void {
    event.preventDefault();
  }

  experienceValidation(event: any): void {
    const intermediateAllowedCharacters = /^-?(\d{0,1}\d?)?(\.\d{0,2})?$/;
    let enteredValue = event?.target?.value + event.key;
    if (event.key === "Backspace" || event.key === "Delete" || event.key.includes("Arrow")) return;
    if (!intermediateAllowedCharacters.test(enteredValue)) event.preventDefault();
  }

  selectTeam(teamId: any, teamName: any): void {
    this.teamListOpen = false;
    this.selectedTeam = teamName;
    this.selectedTeamName = teamId;
  }

  selectDesignation(id: any, name: any): void {
    this.openDesignation = false;
    this.selectedDesignation = name;
    this.selectedDesignationId = id;
  }

  clearFilter(): void {
    this.searchvalue = '';
    this.showSearchBar = false;
    this.skillSuggestions = [];
  }
}
