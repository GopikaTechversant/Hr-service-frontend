import { Component, HostListener, OnInit } from '@angular/core';
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
  @ViewChild('jobtitle') jobtitle!: ElementRef<HTMLInputElement>;
  @ViewChild('jobCode') jobCode!: ElementRef<HTMLInputElement>;
  @ViewChild('maxSalaryInput') maxSalaryInput!: ElementRef<HTMLInputElement>;
  @ViewChild('vacancy') vacancy!: ElementRef<HTMLInputElement>;
  list_id: any = [];
  list_team: any = [];
  idListOpen: boolean = false;
  selectedId: any;
  selectedName: any;
  selectedTeam: string = '';
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
  stationsLists: any;
  designationList: any;
  openDesignation: boolean = false;
  selectedDesignation: string = '';
  selectedDesignationId: any;
  loader: boolean = false;
  constructor(private toastr: ToastrServices, private apiService: ApiService) { }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.returnValue = true;
  }

  ngOnInit(): void {
    this.fetchStations();
    this.fetchServiceTeam();
    this.fetchDesignation();
    // if (history?.state?.requirement) {
    //   this.requirementFromList()
    // }
  }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.teamListOpen = false;
      this.idListOpen = false;
      this.openDesignation = false;
    }
  }
  // requirementFromList():void{
  //   console.log("inside", history?.state?.requirement);

  // }

  fetchDesignation() {
    this.apiService.get(`/service-request/designation/list`).subscribe(((res: any) => {
      if (res?.data) this.designationList = res?.data;
    }))
  }

  fetchServiceId(): void {
    this.apiService.get(`/service-request/services`).subscribe(((res: any) => {
      if (res?.data) this.list_id = res?.data;
    }))
  }

  fetchServiceTeam(): void {
    this.apiService.get(`/service-request/team`).subscribe((res: any) => {
      this.list_team = res.data;
    })
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

  selectId(id: any, name: any): void {
    this.idListOpen = false;
    if (this.selectedId !== id) {
      this.selectedId = id;
      this.selectedName = name;
    }
    this.idListOpen = true;
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
    this.selectedSkills = this.selectedSkills?.filter(skill => skill !== skillToRemove);
  }

  submitClick(): void {
    this.loader = true;
    const skillName = document.getElementById('skillSearch') as HTMLInputElement;
    this.skillNameValue = skillName.value;
    const stationIds = this.selectedStations.map((station: { stationId: any; }) => station.stationId);
    const requestData = {
      requestName: this.jobtitle.nativeElement.value,
      requestSkills: this.selectedSkills.length > 0 ? this.selectedSkills : [this.skillNameValue],
      requestDesignation: this.selectedDesignationId,
      requestCode: this.jobCode.nativeElement.value,
      requestExperience: this.experienceInput.nativeElement.value,
      requestBaseSalary: this.baseSalaryInput.nativeElement.value,
      requestMaxSalary: this.maxSalaryInput.nativeElement.value,
      requestTeam: this.selectedTeamName,
      requestVacancy: this.vacancy.nativeElement.value,
      requestFlowStations: stationIds,
    };
    this.apiService.post(`/service-request/create`, requestData).subscribe((res) => {
      this.loader = false;
      this.toastr.success("Requirement created Successfully");
      this.resetFormAndState();
    }, (err) => {
      this.loader = false;
      if (err?.status === 500) this.toastr.error("Internal Server Error")
      else {
        this.loader = false;
        // this.toastr.warning(err?.message ? err?.message : "Unable to create requirement Please try again");
        this.toastr.warning("Unable to create requirement Please try again");
      }
    })

  }

  clearInputvalue(inputElement: ElementRef<HTMLInputElement>) {
    inputElement.nativeElement.value = '';
  }

  resetFormAndState(): void {
    this.stationsList = [];
    this.selectedTeam = '';
    this.selectedDesignation = '';
    this.clearInputvalue(this.experienceInput);
    this.clearInputvalue(this.jobCode);
    this.clearInputvalue(this.jobtitle);
    this.clearInputvalue(this.baseSalaryInput);
    this.clearInputvalue(this.maxSalaryInput);
    this.clearInputvalue(this.vacancy);
    this.idListOpen = false;
    this.teamListOpen = false;
    this.selectedSkills = [];
    this.selectedStations = [
      { stationName: "Screening", stationId: 1 },
      { stationName: "HR", stationId: 5 }
    ];
  }

  cancel(): void {
    this.resetFormAndState();
  }

}
