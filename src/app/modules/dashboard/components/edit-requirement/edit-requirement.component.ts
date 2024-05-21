import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { ToastrServices } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-edit-requirement',
  templateUrl: './edit-requirement.component.html',
  styleUrls: ['./edit-requirement.component.css']
})
export class EditRequirementComponent implements OnInit {
  selectedStations: any = [
    { stationName: "Screening", stationId: 1 },
    { stationName: "HR", stationId: 5 }
  ];
  stationsList: any[] = [];
  idListOpen: boolean = false;
  stationsLists: any;
  showSearchBar: boolean = false;
  searchvalue: any;
  skillSuggestions: any[] = [];
  selectedSkills: any[] = [];
  loader: boolean = false;
  list_team: any[] = [];
  teamListOpen: boolean = false;
  // selectedTeam: string = '';
  // selectedTeamName: any;
  openDesignation: boolean = false;
  designationList: any;
  // selectedDesignation: string = '';
  // selectedDesignationId: any;
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
  constructor(public dialogRef: MatDialogRef<EditRequirementComponent>, private tostr: ToastrServices, private apiService: ApiService,
    private datePipe: DatePipe, @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit(): void {
    this.fetchDetails();
    console.log("daata", this.data);
    this.initializeDataValues();
  }

  initializeDataValues(): void {
    this.jobTitle = this.data.requestName || '';
    this.jobCode = this.data.requestId || '';
    this.experience = ''; // Assuming this data comes from another source
    this.baseSalary = ''; // Assuming this data comes from another source
    this.maxSalary = ''; // Assuming this data comes from another source
    this.vacancy = this.data.candidatesCount || '';
    this.skills = this.data.requestSkills ? this.data.requestSkills.split(',') : [];
    this.selectedTeam = this.data.teamName || '';
    this.selectedTeamName = this.data.teamId || '';
    this.selectedDesignation = ''; // Assuming this data comes from another source
    this.selectedDesignationId = ''; // Assuming th
  }

fetchDetails():void{
  this.apiService.get(`/service-request/view?requestId=${this.data}`).subscribe((res:any) => {
    console.log("data fetch",res);
    
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
    if (stationName === "Written" || stationName === "Technical") this.stationsList = this.stationsLists.slice(2, -1)
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
    this.selectedSkills = this.selectedSkills?.filter(skill => skill.id !== skillToRemove.id);
  }

  submitClick(): void {
    const payload: any = {};

    if (this.jobTitle !== this.data.requestName) payload.jobTitle = this.jobTitle;
    if (this.jobCode !== this.data.requestId) payload.jobCode = this.jobCode;
    if (this.vacancy !== this.data.candidatesCount) payload.vacancy = this.vacancy;
    if (this.skills.join(',') !== this.data.requestSkills) payload.skills = this.skills;
    if (this.selectedTeam !== this.data.teamName) payload.selectedTeam = this.selectedTeam;
    if (this.selectedTeamName !== this.data.teamId) payload.selectedTeamName = this.selectedTeamName;
    this.apiService.post('/update-requirement', payload).subscribe(response => {
      this.tostr.success('Requirement updated successfully');
      this.dialogRef.close(response);
    }, error => {
      this.tostr.error('Failed to update requirement');
    });

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
}
