import { Component, HostListener, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { ToastrServices } from 'src/app/services/toastr.service';
import { ApiService } from 'src/app/services/api.service';
import { S3Service } from 'src/app/services/s3.service';
import { Subscription } from 'rxjs';

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
  constructor(private apiService: ApiService, private tostr: ToastrServices, private formBuilder: UntypedFormBuilder, private datePipe: DatePipe, private s3Service: S3Service) {
    this.candidateForm = this.formBuilder.group({
      candidateFirstName: [null, Validators.required],
      candidateLastName: [null, Validators.required],
      candidateDoB: [null, Validators.required],
      candidateGender: [null, Validators.required],
      candidateExperience: [null, Validators.required],
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
      resumeSourceId: [null, Validators.required]
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
    if (history?.state?.candidate) {
      this.requirementFromList()
    }
  }

  requirementFromList(): void {
    console.log("inside", history?.state?.candidate);
    this.requirement = history?.state?.candidate;
    this.selectedRequirementId = this.requirement.requestId;
    this.fromRequirementName = this.requirement.requestName;
  }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.showDropdown = false;
      this.showSource = false;
      this.requirementListOpen = false;
    }
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

  nameValidation(event: any): void {
    const allowedCharacters = /^[A-Za-z\s]+$/;
    let enteredValue = event?.target?.value;
    if (!event.ctrlKey && !event.metaKey && !event.altKey && event.key.length === 1) {
      enteredValue += event?.key;
    }
    if (!allowedCharacters.test(enteredValue)) {
      event.preventDefault();
    }
  }

  selectsource(sourceid: any, sourceName: any): void {
    this.sourceId = sourceid;
    this.sourceName = sourceName;
  }

  selectRequirement(requirement: any): void {
    if (this.selectedRequirementName !== requirement?.requestName && this.selectedRequirementId !== requirement?.requestId) {
      this.selectedRequirementName = requirement?.requestName;
      // if(this.fromRequirementName) this.fromRequirementName ==
      this.selectedRequirementId = requirement?.requestId;
      this.maxSalary = requirement?.requestMaxSalary
      this.minSalary = requirement?.requestBaseSalary
      this.candidateForm.patchValue({
        candidateExpectedSalary: null
      });
    }
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

  budgetCheck(event: any): void {
    let enteredValue: string;
    if (event.key === "Backspace") enteredValue = event?.target?.value.slice(0, -1);
    else enteredValue = event.target.value + event.key;
    const allowedCharacters: RegExp = /^[0-9]+$/;
    if (event.key !== "Backspace" && !allowedCharacters.test(enteredValue)) {
      event.preventDefault();
      return;
    }
    // if (this.maxSalary === undefined || this.fromRequirementName.trim() !== '') {
    //   this.tostr.warning(`Please Choose a Requirement`);
    //   return;
    // }
    if (enteredValue && Number(enteredValue) >= this.maxSalary) {
      this.tostr.warning(`Budget should be less than ${this.maxSalary}`);
      event.preventDefault();
    }
  }

  experienceValidation(event: any): void {
    const intermediateAllowedCharacters = /^-?(\d{0,1}\d?)?(\.\d{0,2})?$/;
    let enteredValue = event?.target?.value + event.key;
    if (event.key === "Backspace" || event.key === "Delete" || event.key.includes("Arrow")) return;
    if (!intermediateAllowedCharacters.test(enteredValue)) event.preventDefault();
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
    this.selectedFile = event.target.files[0];
    console.log("this.selectedFile in add ", this.selectedFile);
    if (event.target.files.length > 0) this.resumeUploadSuccess = true;
    if (this.selectedFile) this.s3Service.uploadImage(this.selectedFile, 'hr-service-images', this.selectedFile);
    console.log("this.selectedFile", typeof (this.selectedFile));

    this.getKeyFroms3();
    // if(this.selectedFile) this.s3Service.uploadedFile.emit(this.selectedFile)
  }

  getKeyFroms3(): void {
    this.keySubscription = this.s3Service.key.subscribe((key: string) => {
      console.log("Uploaded file key:", key);
      this.uploadedFileKey = key;
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
        condition: !this.candidateForm?.value?.candidateMobileNo,
        message: 'Please Enter Mobile No'
      },
      {
        condition: !this.sourceId,
        message: 'Please Enter an Application source'
      },
      // {
      //   condition: !this.uploadedFileKey,
      //   message: 'Please Upload Candidate Resume'
      // },
      // {
      //   condition: !this.selectedFile,
      //   message: 'Please Upload Candidate Resume'
      // },
      {
        condition: !this.selectedRequirementId,
        message: 'Please Select a Requirement'
      }
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
    // this.uploadFile();
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
        candidateExperience: this.candidateForm?.value?.candidateExperience,
        candidatePreviousOrg: this.candidateForm?.value?.candidatePreviousOrg,
        candidatePreviousDesignation: this.candidateForm?.value?.candidatePreviousDesignation,
        candidateEducation: this.candidateForm?.value?.candidateEducation,
        candidateCurrentSalary: this.candidateForm?.value?.candidateCurrentSalary,
        candidateExpectedSalary: this.candidateForm?.value?.candidateExpectedSalary,
        // candidateAddress: this.candidateForm?.value?.candidateFirstName,
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
      console.log("payload", payload);
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
  }

  addExtraSkills(): void {
    let skill = document.getElementById('addskill') as HTMLInputElement;
    let skillValue = skill.value;
    this.apiService.post(`/candidate/add/skill?skillName=${skillValue}`, skillValue).subscribe((res: any) => {
      const extraSkill = res?.data;
      this.selectSkill(extraSkill);
    })
  }

  ngOnDestroy(): void {
    if (this.keySubscription) {
      this.keySubscription.unsubscribe();
    }
  }
}
