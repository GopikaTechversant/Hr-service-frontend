import { Component, HostListener, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { ToastrServices } from 'src/app/services/toastr.service';
import { ApiService } from 'src/app/services/api.service';
import { S3Service } from 'src/app/services/s3.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-add-candidate-modal',
  templateUrl: './add-candidate-modal.component.html',
  styleUrls: ['./add-candidate-modal.component.css'],
  providers: [DatePipe],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
})
export class AddCandidateModalComponent implements OnInit {
  displayDate: any;
  showDropdown: boolean = false;
  showSource: boolean = false;
  showPreferredLocation: boolean = false;
  matcher: ErrorStateMatcher = new ShowOnDirtyErrorStateMatcher();
  candidateForm!: UntypedFormGroup;
  submitted: boolean = false;
  fileInputClicked: boolean = false;
  selectedFile: any;
  skillTypes: string[] = ['Primary Skills', 'Secondary Skills'];
  selectedSkillType: any;
  skillSuggestions: any[] = [];
  selectedPrimarySkills: any[] = [];
  selectedSecondarySkills: any[] = [];
  sourceList: any[] = [];
  requirementList: any[] = [];
  sourceId: any;
  sourceName: any;
  showSearchBar: boolean = false;
  primaryskills: any;
  secondaryskills: any;
  searchvalue: string = '';
  selectedRequirementName: any;
  selectedRequirementId: any;
  validationSuccess: boolean = false;
  requirementListOpen: boolean = false;
  candidateCreatedby: any;
  resumeUploadSuccess: boolean = false;
  maxDate: any;
  currentYear: any;
  maxSalary: any;
  minSalary: any;
  fileName: any;
  extraSkills: any[] = [];
  loader: boolean = false;
  submitForm: boolean = false;
  fromRequirementId: any;
  fromRequirementName: string = '';
  requirement: any;
  private keySubscription?: Subscription;
  uploadedFileKey: string = '';
  preferredLocation: any[] = [];
  locationName: any;
  locationId: any;
  searchKeyword: string = '';
  candidateList: any[] = [];
  showCandidates: boolean = false;
  mailInput: boolean = false;
  numberInput: boolean = false;
  firstNameInput: boolean = false;
  lastNameInput: boolean = false;

  constructor(private apiService: ApiService, private tostr: ToastrServices, private formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe, private s3Service: S3Service, private router: Router, private route: ActivatedRoute) {
    this.candidateForm = this.formBuilder.group({
      candidateFirstName: [null, Validators.required],
      candidateLastName: [null, Validators.required],
      candidateDoB: [null, Validators.required],
      candidateGender: [null, Validators.required],
      candidateRevlentExperience: [null, Validators.required],
      candidateTotalExperience: [null, Validators.required],
      candidatePreferlocation: [null, Validators.required],
      candidatePreviousOrg: [null, Validators.required],
      candidatePreviousDesignation: [null, Validators.required],
      candidateEducation: [null, Validators.required],
      candidateCurrentSalary: [null, Validators.required],
      candidateExpectedSalary: [null, Validators.required],
      candidateCity: [null, Validators.required],
      candidateDistrict: [null, Validators.required],
      candidateState: [null, Validators.required],
      candidateEmail: [null, Validators.required],
      candidateMobileNo: [null, Validators.required],
      resumeSourceId: [null, Validators.required],
    })
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.returnValue = true;
  }

  ngOnInit(): void {
  
    this.candidateCreatedby = localStorage.getItem('userId');
    this.currentYear = new Date().getFullYear();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.currentYear - 18);
    this.fetchRequerements();
    this.fetchSource();
    this.fetchLocation();
    if (history?.state?.candidate) {
      this.requirementFromList()
    }
  }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.showDropdown = false;
      this.showSource = false;
      this.requirementListOpen = false;
      this.showCandidates = false;
      this.searchKeyword = '';
    }
  }

  requirementFromList(): void {
    this.requirement = history?.state?.candidate;
    this.selectedRequirementId = this.requirement.requestId;
    this.fromRequirementName = this.requirement.requestName;
  }

  fetchSource(): void {
    this.apiService.get(`/candidate/resume-source/list`).subscribe((res: any) => {
      this.sourceList = res?.data;
    })
  }

  fetchRequerements(): void {
    this.apiService.get(`/service-request/list`).subscribe((res: any) => {
      this.requirementList = res?.data;
    })
  }

  fetchLocation(): void {
    this.apiService.get(`/user/preffer-location`).subscribe((res: any) => {
      this.preferredLocation = res?.data;
    })
  }

  nameValidation(event: any): void {
    const allowedCharacters = /^[\.\&A-Za-z\s]+$/;
    let enteredValue = event?.target?.value;
    // Allow Ctrl + C (copy) and Ctrl + V (paste)
    if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'v' || event.key === 'A') ) {
      return;
    }
  
    if (!event.ctrlKey && !event.metaKey && !event.altKey && event?.key?.length === 1) {
      enteredValue += event?.key;
    }
  
    if (!allowedCharacters.test(enteredValue)) {
      event.preventDefault();
    }
  }

  namePasteValidation(event: ClipboardEvent): void {
    const pastedData = event.clipboardData?.getData('text') || '';
    const allowedCharacters = /^[\.\&A-Za-z\s]+$/;
  
    if (!allowedCharacters.test(pastedData)) {
      event.preventDefault(); // Prevent paste if invalid characters are found
    }
  }
  

  selectsource(sourceid: any, sourceName: any): void {
    this.sourceId = sourceid;
    this.sourceName = sourceName;
  }

  selectRequirement(requirement: any): void {
    if (this.selectedRequirementName !== requirement?.requestName && this.selectedRequirementId !== requirement?.requestId) {
      this.selectedRequirementName = requirement?.requestName;
      this.selectedRequirementId = requirement?.requestId;
      this.maxSalary = requirement?.requestMaxSalary
      this.minSalary = requirement?.requestBaseSalary
      this.candidateForm.patchValue({
        candidateExpectedSalary: null
      });
    }
  }

  selectPreferredLocation(name: any): void {
    this.locationName = name;
  }

  onKeypressSalary(event: KeyboardEvent, inputElement: HTMLInputElement): void {
    const target = inputElement;
    if (!target) return;

    const allowedKeys = /[0-9.,]/;
    const controlKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
    const key = event.key;
 // Allow Ctrl + C (copy) and Ctrl + V (paste)
 if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'v')) {
  return;
}

    if (!allowedKeys.test(key) && !controlKeys.includes(key)) {
      event.preventDefault();
      return;
    }

    if (controlKeys.includes(key)) return;

    let value = target.value.replace(/,/g, '');
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

  onKeypress(event: any): void {
    let enteredValue: string;
    if (event.key === "Backspace") enteredValue = event?.target?.value.slice(0, -1);
    else enteredValue = event.target.value + event.key;
    const allowedCharacters: RegExp = /^[0-9]+$/;
     // Allow Ctrl + C (copy) and Ctrl + V (paste)
     if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'v')) {
      return;
    }
  
    if (event.key !== "Backspace" && !allowedCharacters.test(enteredValue)) {
      event.preventDefault();
      return;
    }
  }

  onPaste(event: ClipboardEvent): void {
    // event.preventDefault();
  }

  budgetCheck(event: any): void {
    let enteredValue: string;
    if (event.key === "Backspace") enteredValue = event?.target?.value.slice(0, -1);
    else enteredValue = event.target.value + event.key;
    const allowedCharacters: RegExp = /^[0-9]+$/;
    if (event.key !== "Backspace" && !allowedCharacters.test(enteredValue)) {
      event.preventDefault();
      return;
    }
    if (enteredValue && Number(enteredValue) >= this.maxSalary) {
      this.tostr.warning(`Budget should be less than ${this.maxSalary}`);
      event.preventDefault();
    }
  }

  experienceValidation(event: any): void {
    const intermediateAllowedCharacters = /^-?(\d{0,1}\d?)?(\.\d{0,2})?\+?$/;
    let enteredValue = event?.target?.value + event.key;

    if (
      event.key === "Backspace" ||
      event.key === "Delete" ||
      event.key.includes("Arrow")
    ) return;

    if (!intermediateAllowedCharacters.test(enteredValue)) {
      event.preventDefault();
    }
  }


  dateChange(event: any): void {
    let date = new Date(event?.value);
    this.displayDate = this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  selectSkillType(type: any): void {
    this.selectedSkillType = type;
    this.searchvalue = '';
  }

  toggleSearchBar(): void {
    this.showSearchBar = !this.showSearchBar;
  }

  onFileSelected(event: any) {
    this.fileInputClicked = true;
    this.selectedFile = event?.target?.files?.[0];
    if (event?.target?.files?.length > 0) {
      this.resumeUploadSuccess = true;
    }
    if (this.selectedFile) {
      this.loader = true;
      this.s3Service.uploadImage(this.selectedFile, 'hr-service-images', this.selectedFile);
    } else {
      this.loader = false;
    }
    this.getKeyFroms3();
  }

  getKeyFroms3(): void {
    this.keySubscription = this.s3Service.key.subscribe((key: string) => {
      this.uploadedFileKey = key;
      if (!this.uploadedFileKey) {
        this.loader = false;
        this.tostr.error('Something Went Wrong Please Try Again');
      } else {
        this.loader = false;
        this.tostr.success('File upload Successfully');
      }
    });
  }

  uploadFile(): void {
    if (this.selectedFile) this.s3Service.uploadImage(this.selectedFile, 'hr-service-images', this.selectedFile);
  }

  checkValidation(): void {
    const validations = [
      {
        condition: !this.candidateForm?.value?.candidateEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.candidateForm?.value?.candidateEmail),
        message: 'Please Enter a Valid email'
      },
      {
        condition: !this.candidateForm?.value?.candidateFirstName,
        message: 'Please Enter the First Name'
      },
      {
        condition: !this.candidateForm?.value?.candidateLastName,
        message: 'Please Enter the Last Name'
      },
      {
        condition: !this.candidateForm?.value?.candidateGender,
        message: 'Please Enter Gender'
      },
      {
        condition: !/^\d+$/.test(this.candidateForm?.value?.candidateMobileNo),
        message: 'Please Enter a Valid Mobile No'
      },
      {
        condition: !this.sourceId,
        message: 'Please Enter an Application source'
      },
    ];
    this.validationSuccess = true;
    validations.forEach(({ condition, message }) => {
      if (condition) {
        this.loader = false;
        this.tostr.warning(message);
        this.validationSuccess = false;
      }
    });
  }

  // submitClick(): void {
  //   this.loader = true;
  //   this.checkValidation();
  //   if (this.validationSuccess) {
  //     let candidateDetails = this.candidateForm.value;
  //     this.primaryskills = this.selectedPrimarySkills.map(skill => skill.id);
  //     this.secondaryskills = this.selectedSecondarySkills.map(skill => skill.id);
  //     const formdata = new FormData();
  //     for (const key in candidateDetails) {
  //       if (candidateDetails[key]) formdata.append(key, candidateDetails[key]);
  //     }
  //     formdata.append('candidateCreatedby', this.candidateCreatedby);
  //     formdata.append('candidateResume', this.selectedFile);
  //     formdata.append('candidatePrimarySkills', this.primaryskills);
  //     formdata.append('candidateSecondarySkills', this.secondaryskills);
  //     formdata.append('resumeSourceId', this.sourceId);
  //     formdata.append('candidatesAddingAgainst', this.selectedRequirementId);

  //     this.apiService.post(`/candidate/create`, formdata).subscribe({
  //       next: (response) => {
  //         this.loader = false;
  //         this.tostr.success('Candidate Created successfully');
  //         this.resetFormAndState();
  //       },
  //       error: (error) => {
  //         this.loader = false;
  //         if (error?.status === 500) {
  //           this.tostr.error("Internal Server Error");
  //         } else {
  //           this.loader = false;
  //           this.tostr.warning(error?.error?.message ? error?.error?.message : "Unable to Add candidate");
  //         }
  //       },
  //     });
  //   } else {
  //     this.submitted = true;
  //   }
  // }
  submitClick(): void {
    this.submitForm = true;
    this.loader = true;
    this.checkValidation();
    if (this.validationSuccess) {
      let candidateDetails = this.candidateForm.value;
      this.primaryskills = this.selectedPrimarySkills.map(skill => skill.id);
      this.secondaryskills = this.selectedSecondarySkills.map(skill => skill.id);

      const payload = {
        candidateFirstName: this.candidateForm?.value?.candidateFirstName,
        candidateLastName: this.candidateForm?.value?.candidateLastName,
        candidateEmail: this.candidateForm?.value?.candidateEmail,
        candidateMobileNo: this.candidateForm?.value?.candidateMobileNo,
        candidateDoB: this.candidateForm?.value?.candidateDoB,
        candidateRevlentExperience: this.candidateForm?.value?.candidateRevlentExperience,
        candidateTotalExperience: this.candidateForm?.value?.candidateTotalExperience,
        candidatePreferlocation: this.locationName,
        candidatePreviousOrg: this.candidateForm?.value?.candidatePreviousOrg,
        candidatePreviousDesignation: this.candidateForm?.value?.candidatePreviousDesignation,
        candidateEducation: this.candidateForm?.value?.candidateEducation,
        candidateCurrentSalary: this.candidateForm?.value?.candidateCurrentSalary,
        candidateExpectedSalary: this.candidateForm?.value?.candidateExpectedSalary,
        candidateCreatedby: this.candidateCreatedby,
        candidatePrimarySkills: this.primaryskills,
        candidateSecondarySkills: this.secondaryskills,
        resumeSourceId: this.sourceId,
        candidatesAddingAgainst: this.selectedRequirementId,
        candidateGender: this.candidateForm?.value?.candidateGender,
        candidateCity: this.candidateForm?.value?.candidateCity,
        candidateDistrict: this.candidateForm?.value?.candidateDistrict,
        candidateState: this.candidateForm?.value?.candidateState,
        candidateResume: this.uploadedFileKey
      }
      this.apiService.post(`/candidate/create`, payload).subscribe({
        next: (response) => {
          this.loader = false;
          this.tostr.success('Candidate Created successfully');
          this.resetFormAndState();

        },
        error: (error) => {
          this.loader = false;
          if (error?.status === 500) {
            this.tostr.error("Internal Server Error");
          } else {
            this.loader = false;
            this.tostr.warning(error?.error?.message ? error?.error?.message : "Unable to Add candidate");
          }
        },
      });
    } else {
      this.submitted = true;
    }
  }

  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
    fileInput.click();
  }

  cancel() {
    this.resetFormAndState();
  }

  resetFormAndState(): void {
    this.candidateForm.reset();
    this.selectedPrimarySkills = [];
    this.selectedSecondarySkills = [];
    this.sourceName = null;
    this.selectedRequirementName = null;
    this.selectedRequirementId = null;
    this.showDropdown = false;
    this.showSource = false;
    this.showSearchBar = false;
    this.resumeUploadSuccess = false;
    this.selectedFile = null;
    this.primaryskills = null;
    this.secondaryskills = null;
    this.sourceId = null;
  }

  getSkillSuggestions(event: any): void {
    this.searchvalue = event?.target.value;
    if (this.selectedSkillType) {
      this.apiService.get(`/candidate/skills/list?search=${this.searchvalue}`).subscribe((res: any) => {
        this.skillSuggestions = res?.data.filter((suggestion: any) =>
          suggestion.skillName.toLowerCase().startsWith(this.searchvalue.toLowerCase()) && !this.isSkillSelected(suggestion)
        );
      });
    }
  }

  removeSkill(skillToRemove: any, type: 'primary' | 'secondary'): void {
    if (type === 'primary') {
      this.selectedPrimarySkills = this.selectedPrimarySkills?.filter(skill => skill.id !== skillToRemove.id);
    } else if (type === 'secondary') {
      this.selectedSecondarySkills = this.selectedSecondarySkills?.filter(skill => skill.id !== skillToRemove.id);
    }
  }

  isSkillSelected(suggestion: any): boolean {
    const allSelectedSkills = [...this.selectedPrimarySkills, ...this.selectedSecondarySkills];
    return allSelectedSkills.some(selectedSkill => selectedSkill.id === suggestion.id);
  }

  selectSkill(suggestion: any): void {
    const selectedSkill = { id: suggestion.id, name: suggestion.skillName };
    if (this.selectedSkillType === 'Primary Skills') this.selectedPrimarySkills.push(selectedSkill);
    else if (this.selectedSkillType === 'Secondary Skills') this.selectedSecondarySkills.push(selectedSkill);
    this.showSearchBar = false;
    this.skillSuggestions = [];
    this.searchvalue = '';
  }

  searchCandidate(searchKeyword: string, type: string): void {
    this.resetInputFlags();
    switch (type.trim()) {
      case 'mail':
        this.mailInput = true;
        break;
      case 'number':
        this.numberInput = true;
        break;
      case 'firstName':
        this.firstNameInput = true;
        break;
      case 'lastName':
        this.lastNameInput = true;
        break;
    }

    if (searchKeyword.trim() !== '') {
      this.apiService.get(`/candidate/search/list?search=${searchKeyword}`).subscribe(
        (res: any) => {
          this.candidateList = res?.data || [];
          this.showCandidates = this.candidateList.length > 0;
          if (!this.showCandidates) this.resetInputFlags();
        },
        () => this.handleSearchError()
      );
    } else {
      this.handleSearchError();
    }

  }

  private resetInputFlags(): void {
    this.mailInput = false;
    this.numberInput = false;
    this.firstNameInput = false;
    this.lastNameInput = false;
  }

  private handleSearchError(): void {
    this.showCandidates = false;
    this.resetInputFlags();
  }


  selectCandidate(id: any): void {
    this.router.navigateByUrl(`/dashboard/candidate-details/${id}`);
    this.searchKeyword = '';
  }

  ngOnDestroy(): void {
    if (this.keySubscription) {
      this.keySubscription.unsubscribe();
    }
  }
}
