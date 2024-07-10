import { Component, HostListener, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { ToastrServices } from 'src/app/services/toastr.service';
import { ApiService } from 'src/app/services/api.service';
import { DatePipe } from '@angular/common';

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
  @ViewChild('maxExperienceInput') maxExperienceInput!: ElementRef<HTMLInputElement>;
  @ViewChild('minExperienceInput') minExperienceInput!: ElementRef<HTMLInputElement>;
  @ViewChild('baseSalaryInput') baseSalaryInput!: ElementRef<HTMLInputElement>;
  @ViewChild('jobtitle') jobtitle!: ElementRef<HTMLInputElement>;
  @ViewChild('jobCode') jobCode!: ElementRef<HTMLInputElement>;
  @ViewChild('maxSalaryInput') maxSalaryInput!: ElementRef<HTMLInputElement>;
  @ViewChild('vacancy') vacancy!: ElementRef<HTMLInputElement>;
  @ViewChild('comment') commentDiv!: ElementRef<HTMLDivElement>;

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
  searchvalue: string = "";
  skillSuggestions: any[] = [];
  showSearchBar: boolean = false;
  selectedSkills: any[] = [];
  skillNameValue: string = '';
  stationIdToRemove: any;
  stationsLists: any;
  designationList: any;
  openDesignation: boolean = false;
  openReporingManager: boolean = false;
  selectedDesignation: string = '';
  selectedDesignationId: any;
  loader: boolean = false;
  panel_list: any[] = [];
  maxDate: any;
  currentYear: any;
  minDate: any;
  commentValue: any = '';
  today: Date = new Date();
  displayDate: string | null = null;
  closeDate: string | null = null;
  postDate: Date | null = null;
  closeDateObj: Date | null = null;
  managerName: string = '';
  managerId: any;
  jobDescription: any
  textFormats: any[] = ['Aa', 'AA', 'aa', 'Aa A'];
  showFormats: boolean = false;
  option: any;
  isBold = false;

  constructor(private toastr: ToastrServices, private apiService: ApiService, private datePipe: DatePipe) { }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.returnValue = true;
  }
  ngAfterViewInit(): void {
    this.commentDiv.nativeElement.addEventListener('input', () => {
      this.jobDescription = this.commentDiv.nativeElement.innerHTML;
    });
  }

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
    this.maxDate = new Date();
    this.minDate = new Date();
    this.fetchStations();
    this.fetchServiceTeam();
    this.fetchDesignation();
    this.fetchPanel();
  }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.teamListOpen = false;
      this.idListOpen = false;
      this.openDesignation = false;
      this.openReporingManager = false;
      this.showFormats = false;
    }
  }

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

  fetchPanel(): void {
    this.apiService.get(`/user/lists?userRole=2`).subscribe((res: any) => {
      if (res?.users) this.panel_list = res?.users;
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

  dateChange(event: any, range: string): void {
    let date = new Date(event?.value);
    if (range == 'postdate') this.displayDate = this.datePipe.transform(date, 'MM/dd/yyyy');
    if (range == 'closeDate') this.closeDate = this.datePipe.transform(date, 'MM/dd/yyyy');
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

  selectReportingManager(id: any, name: any): void {
    this.openReporingManager = false;
    this.managerName = name;
    this.managerId = id;
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
    this.searchvalue = '';
  }

  removeSkill(skillToRemove: any): void {
    this.selectedSkills = this.selectedSkills?.filter(skill => skill !== skillToRemove);
  }

  execCommand(command: string): void {
    document.execCommand(command, false, undefined);
    this.jobDescription = this.commentDiv.nativeElement.innerHTML;
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
    this.loader = true;
    const comments = document.getElementById('comments') as HTMLInputElement;
    this.commentValue = comments.innerText;
    const skillName = document.getElementById('skillSearch') as HTMLInputElement;
    this.skillNameValue = skillName.value;
    const stationIds = this.selectedStations.map((station: { stationId: any; }) => station.stationId);
    const requestData = {
      requestName: this.jobtitle.nativeElement.value,
      requestSkills: this.selectedSkills.length > 0 ? this.selectedSkills : [this.skillNameValue],
      requestDesignation: this.selectedDesignationId,
      requestCode: this.jobCode.nativeElement.value,
      requestMinimumExperience: this.minExperienceInput.nativeElement.value,
      requestMaximumExperience: this.maxExperienceInput.nativeElement.value,
      requestBaseSalary: this.baseSalaryInput.nativeElement.value,
      requestMaxSalary: this.maxSalaryInput.nativeElement.value,
      requestTeam: this.selectedTeamName,
      requestVacancy: this.vacancy.nativeElement.value,
      requestFlowStations: stationIds,
      requestDescription: this.jobDescription ? this.jobDescription : this.commentValue,
      requestPostingDate: this.displayDate,
      requestClosingDate: this.closeDate,
      requestManager: this.managerId
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
        this.toastr.warning("Unable to create requirement Please try again");
      }
    })
  }

  clearInputvalue(inputElement: ElementRef<HTMLInputElement>) {
    inputElement.nativeElement.value = '';
  }

  resetFormAndState(): void {
    // const comments = document.getElementById('comments') as HTMLInputElement;
    // if (comments) comments.value = '';
    // this.commentValue = '';
    this.stationsList = [];
    this.selectedTeam = '';
    this.selectedDesignation = '';
    // this.commentValue = '';
    const commentsDiv = this.commentDiv.nativeElement;
    if (commentsDiv) commentsDiv.innerHTML = '';
    this.clearInputvalue(this.maxExperienceInput);
    this.clearInputvalue(this.minExperienceInput)
    this.clearInputvalue(this.jobCode);
    this.clearInputvalue(this.jobtitle);
    this.clearInputvalue(this.baseSalaryInput);
    this.clearInputvalue(this.maxSalaryInput);
    this.clearInputvalue(this.vacancy);
    this.managerName = '';
    this.displayDate = null;
    this.closeDate = null;
    this.postDate = null;
    this.closeDateObj = null;
    this.idListOpen = false;
    this.teamListOpen = false;
    this.selectedSkills = [];
    this.searchvalue = '';
    this.jobDescription = '';
    this.selectedStations = [
      { stationName: "Screening", stationId: 1 },
      { stationName: "HR", stationId: 5 }
    ];
  }

  cancel(): void {
    this.resetFormAndState();
  }

  clearFilter(): void {
    this.searchvalue = '';
    this.showSearchBar = false;
    this.skillSuggestions = [];
  }
  
  onKeypressSalary(event: KeyboardEvent, inputElement: HTMLInputElement): void {
    const target = inputElement;
    if (!target) return;

    const allowedKeys = /[0-9.,]/;
    const controlKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
    const key = event.key;

    if (!allowedKeys.test(key) && !controlKeys.includes(key)) {
      event.preventDefault();
      return;
    }

    if (controlKeys.includes(key)) return;

    let value = target.value.replace(/,/g, '');
    // Only allow one dot
    if (key === '.' && value.includes('.')) {
      event.preventDefault();
      return;
    }

    value = value.replace(/[^0-9.]/g, '');
    const parts = value.split(".");
    let integerPart = parts[0];
    const decimalPart = parts[1];

    integerPart = integerPart.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    if (decimalPart !== undefined) {
      target.value = integerPart + "." + decimalPart.slice(0, 2);
    } else {
      target.value = integerPart;
    }
  }

  onPasteSalary(event: ClipboardEvent, inputElement: HTMLInputElement): void {
    const clipboardData = event.clipboardData;
    if (!clipboardData) {
      event.preventDefault();
      return;
    }

    let pastedData = clipboardData.getData('Text');
    pastedData = pastedData.replace(/,/g, ''); // Remove existing commas

    const allowedCharacters: RegExp = /^[0-9]*\.?[0-9]*$/;
    if (!allowedCharacters.test(pastedData)) {
      event.preventDefault();
      return;
    }

    const parts = pastedData.split(".");
    let integerPart = parts[0];
    const decimalPart = parts[1];

    integerPart = integerPart.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    if (decimalPart !== undefined) {
      pastedData = integerPart + "." + decimalPart.slice(0, 2);
    } else {
      pastedData = integerPart;
    }

    inputElement.value = pastedData;
    event.preventDefault();
  }


}
