import { Component, HostListener, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { ToastrServices } from 'src/app/services/toastr.service';
import { ApiService } from 'src/app/services/api.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-service-request',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.css'],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
})
export class ServiceRequestComponent implements OnInit {
  @ViewChild('comment') commentDiv!: ElementRef<HTMLDivElement>;
  list_team: any = [];
  idListOpen: boolean = false;
  selectedId: any;
  selectedName: any;
  teamListOpen: boolean = false;
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
  stationsLists: any;
  designationList: any;
  openDesignation: boolean = false;
  openReporingManager: boolean = false;
  loader: boolean = false;
  maxDate: any;
  currentYear: any;
  minDate: any;
  today: Date = new Date();
  displayDate: string | null = null;
  closeDate: string | null = null;
  postDate: Date | null = null;
  closeDateObj: Date | null = null;
  jobDescription: any
  textFormats: any[] = ['Aa', 'AA', 'aa', 'Aa A'];
  showFormats: boolean = false;
  option: any;
  isBold = false;
  requestId: any;
  requirement_details: any = {};
  formattedText: SafeHtml | undefined;
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
  flows: any[] = [];
  managerName: string = '';
  managerId: any;
  panel_list: any[] = [];
  managerListOpen: boolean = false;
  description: any;
  candidateCount: string = '0';
  constructor(private toastr: ToastrServices, private apiService: ApiService, private datePipe: DatePipe, private route: ActivatedRoute, private sanitizer: DomSanitizer) {
    this.route.queryParams.subscribe(params => {
      this.requestId = params['requestId'];
    });
  }

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
    if (this.requestId) this.fetchDetails()
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

  fetchDetails(): void {
    this.apiService.get(`/service-request/view?requestId=${this.requestId}`).subscribe((res: any) => {
      if (res?.data) {
        this.requirement_details = res?.data;
        this.candidateCount = this.requirement_details?.candidatesCount;
        const text = this.requirement_details?.requestDescription;
        this.formattedText = this.sanitizer.bypassSecurityTrustHtml(text);
        this.flows = res?.flows;
        this.initializeDataValues();
      }
    })
  }

  fetchDesignation() {
    this.apiService.get(`/service-request/designation/list`).subscribe(((res: any) => {
      if (res?.data) this.designationList = res?.data;
    }))
  }

  fetchServiceTeam(): void {
    this.apiService.get(`/service-request/team`).subscribe((res: any) => {
      if (res.data) this.list_team = res.data;
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

  selectmanager(id: any, fname: any, lname: any): void {
    this.managerListOpen = false;
    this.reportingmanager = `${fname} ${lname}`;
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

  initializeDataValues(): void {
    this.jobTitle = this.requirement_details.requestName || '';
    this.jobCode = this.requirement_details.requestCode || '';
    this.experience = this.requirement_details.requestMaximumExperience || '';
    this.minExperience = this.requirement_details.requestMinimumExperience || '';
    this.baseSalary = this.requirement_details.requestBaseSalary || '';
    this.maxSalary = this.requirement_details.requestMaxSalary || '';
    this.vacancy = this.requirement_details.requestVacancy || '';
    this.selectedSkills = this.requirement_details.requestSkills ? this.requirement_details.requestSkills.split(',') : [];
    this.selectedTeam = this.requirement_details?.team?.teamName || '';
    this.selectedDesignation = this.requirement_details.designationName || '';
    this.reportingmanager = this.requirement_details?.reporting?.userFullName || '';
    this.description = this.requirement_details.requestDescription || '';
    this.postDate = this.requirement_details.requestPostingDate || null;
    this.closeDateObj = this.requirement_details.requestClosingDate || null;
    if (this.flows) {
      this.selectedStations = this.flows.map((flow: any) => ({
        stationId: flow.flowStationId,
        stationName: flow.flowStationName
      }));
    } else this.selectedStations = [];
  }

  submitClick(): void {
    const payload: any = {};   
    // Build the payload
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
    if (this.selectedTeam !== this.requirement_details?.team?.teamName) payload.requestTeam = this.selectedTeamName;
    if (this.reportingmanager !== this.requirement_details?.reporting?.userFullName) payload.requestManager = this.managerId;
    if (this.displayDate !== this.requirement_details.requestPostingDate) {
      payload.requestPostingDate = this.displayDate;
      payload.requestClosingDate = this.closeDate;
    }
    
    const currentDescription = this.commentDiv.nativeElement.innerHTML;
    if (currentDescription !== this.requirement_details.requestDescription) payload.requestDescription = currentDescription;
  
    // Check mandatory fields
    const allFieldsFilled = this.jobTitle && this.jobCode && this.vacancy && this.skills && this.selectedStations && this.experience && this.selectedDesignation && this.baseSalary && this.maxSalary && this.selectedTeam;
  
    if (allFieldsFilled) {
      if (this.requestId) {
        if (this.candidateCount === '0') {
          payload.requestId = this.requestId;
          this.handleApiCall('post', '/service-request/edit', payload);
        } else {
          this.handleApiCall('patch', `/service-request/edit-requestion/${this.requestId}`, payload);
        }
      } else {
        this.handleApiCall('post', '/service-request/create', payload);
      }
    } else {
      this.toastr.warning('Please fill all mandatory fields');
    }
  }
  
  // Helper method to handle API calls
  private handleApiCall(method: 'post' | 'patch', url: string, payload: any): void {
    this.apiService[method](url, payload).subscribe(
      response => {
        const successMessage = method === 'post' ? 'Requirement created successfully' : 'Requirement updated successfully';
        this.toastr.success(successMessage);
        this.resetFormAndState();
      },
      error => {
        const errorMessage = method === 'post' ? 'Failed to create requirement' : 'Failed to update requirement';
        this.toastr.error(errorMessage);
        console.error('API Error:', error);
      }
    );
  }

  clearInputvalue(inputElement: ElementRef<HTMLInputElement>) {
    inputElement.nativeElement.value = '';
  }

  resetFormAndState(): void {
    this.stationsList = [];
    this.selectedTeam = '';
    this.selectedDesignation = '';
    this.jobTitle = '';
    this.jobCode = '';
    this.baseSalary = '';
    this.maxSalary = '';
    this.minExperience = '';
    this.experience = '';
    this.vacancy = '';
    this.reportingmanager = '';
    const commentsDiv = this.commentDiv.nativeElement;
    if (commentsDiv) commentsDiv.innerHTML = '';
    this.displayDate = null;
    this.closeDate = null;
    this.postDate = null;
    this.closeDateObj = null;
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
