import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { ToastrServices } from 'src/app/services/toastr.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-edit-requirement',
  templateUrl: './edit-requirement.component.html',
  styleUrls: ['./edit-requirement.component.css']
})
export class EditRequirementComponent implements OnInit {
  public onEditSuccess: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('comment') commentDiv!: ElementRef<HTMLDivElement>;

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
  managerListOpen: boolean = false;
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
  minExperience: string = '';
  baseSalary: string = '';
  maxSalary: string = '';
  vacancy: string = '';
  skills: string[] = [];
  selectedTeam: string = '';
  selectedTeamName: any;
  selectedDesignation: string = '';
  reportingmanager: string = '';
  selectedDesignationId: any;
  initialValues: any = {};
  requirement_details: any = {};
  flows: any[] = [];
  managerName: string = '';
  managerId: any;
  panel_list: any[] = [];
  formattedText: SafeHtml | undefined;
  jobDescription: any
  option: any;
  showFormats: boolean = false;
  textFormats: any[] = ['Aa', 'AA', 'aa', 'Aa A'];
  description: any;
  constructor(public dialogRef: MatDialogRef<EditRequirementComponent>, private tostr: ToastrServices, private apiService: ApiService, private sanitizer: DomSanitizer,
    private datePipe: DatePipe, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.fetchDetails();
    this.fetchStations();
    this.fetchServiceTeam();
    this.fetchDesignation();
    this.fetchPanel();
  }

  initializeDataValues(): void {
    this.jobTitle = this.requirement_details.requestName || '';
    this.jobCode = this.requirement_details.requestCode || '';
    this.experience = this.requirement_details.requestMaximumExperience || '';
    this.minExperience = this.requirement_details.requestMinimumExperience || '';
    this.baseSalary = this.requirement_details.requestBaseSalary || '';
    this.maxSalary = this.requirement_details.requestMaxSalary || '';
    this.vacancy = this.requirement_details.requestVacancy || '';
    this.selectedSkills = this.requirement_details.requestSkills ? this.requirement_details.requestSkills.split(',') : [];
    this.selectedTeam = this.requirement_details.team.teamName || '';
    this.selectedDesignation = this.requirement_details.designationName || '';
    this.reportingmanager = this.requirement_details.reporting.userFullName || '';
    this.description = this.requirement_details.requestDescription || '';
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
      const text = this.requirement_details?.requestDescription;
      this.formattedText = this.sanitizer.bypassSecurityTrustHtml(text);
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
  fetchPanel(): void {
    this.apiService.get(`/user/lists?userRole=2`).subscribe((res: any) => {
      if (res?.users) this.panel_list = res?.users;
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
  select(option: string): void {
    this.option = option;
    if (option === 'Aa') {
      this.textAreaFormat('sentencecase');
    } else if (option === 'AA') {
      this.textAreaFormat('upperCase');
    } else if (option === 'aa') {
      this.textAreaFormat('lowerCase');
    } else if (option === 'Aa A') {
      this.textAreaFormat('titlecase');
    }
  }
  removeSkill(skillToRemove: any): void {
    this.selectedSkills = this.selectedSkills?.filter(skill => skill !== skillToRemove);
  }

  execCommand(command: string): void {
    document.execCommand(command, false, undefined);
  }

  textAreaFormat(event: string): void {
    const div = this.commentDiv.nativeElement;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText) return;
    let replace: string = selectedText;
    if (event === 'upperCase') {
      replace = selectedText.toUpperCase();
    } else if (event === 'lowerCase') {
      replace = selectedText.toLowerCase();
    } else if (event === 'paragraph') {
      replace = selectedText.replace(/(\r\n|\n|\r)/gm, " ");
    } else if (event === 'sentencecase') {
      replace = this.sentenceCase(selectedText);
    } else if (event === 'titlecase') {
      replace = this.titleCase(selectedText);
    } else {
      return;
    }
    const newNode = document.createTextNode(replace);
    range.deleteContents();
    range.insertNode(newNode);
    this.jobDescription = div.innerHTML;
  }

  sentenceCase(str: string): string {
    let result = '';
    let capitalizeNext = true;
    for (let i = 0; i < str.length; i++) {
      const char = str.charAt(i);
      if (capitalizeNext && /[a-zA-Z]/.test(char)) {
        result += char.toUpperCase();
        capitalizeNext = false;
      } else {
        result += char.toLowerCase();
      }
      if (char === '.' || char === '!' || char === '?') {
        let nextIndex = i + 1;
        while (nextIndex < str.length && str.charAt(nextIndex) === ' ') {
          nextIndex++;
        }
        capitalizeNext = true;
        i = nextIndex - 1;
      }
    }
    return result;
  }

  titleCase(str: string): string {
    return str.toLowerCase().split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
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
    if (this.minExperience !== this.requirement_details.requestMinimumExperience) payload.requestMinimumExperience = this.minExperience;
    if (this.selectedDesignation !== this.requirement_details.designationName) payload.requestDesignation = this.selectedDesignationId;
    if (this.baseSalary !== this.requirement_details.requestBaseSalary) payload.requestBaseSalary = this.baseSalary;
    if (this.maxSalary !== this.requirement_details.requestMaxSalary) payload.requestMaxSalary = this.maxSalary;
    if (this.selectedTeam !== this.requirement_details.team.teamName) payload.requestTeam = this.selectedTeamName;
    if (this.reportingmanager !== this.requirement_details?.reporting.userFullName) payload.requestManager = this.managerId;
    const currentDescription = this.commentDiv.nativeElement.innerHTML;
    if (currentDescription !== this.requirement_details.requestDescription) payload.requestDescription = currentDescription;
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

  selectmanager(id: any, fname: any, lname: any): void {
    this.managerListOpen = false;
    this.reportingmanager = `${fname} ${lname}`;
    this.managerId = id;
  }

  clearFilter(): void {
    this.searchvalue = '';
    this.showSearchBar = false;
    this.skillSuggestions = [];
  }
}
