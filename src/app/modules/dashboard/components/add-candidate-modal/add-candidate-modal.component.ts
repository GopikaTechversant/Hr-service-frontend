import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { ToastrServices } from 'src/app/services/toastr.service';
import { ApiService } from 'src/app/services/api.service';
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
  displayDate: any
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
  searchvalue: any;
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

  constructor(private apiService: ApiService, private tostr: ToastrServices, private formBuilder: UntypedFormBuilder, private datePipe: DatePipe) {
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

  ngOnInit(): void {
    this.candidateCreatedby = localStorage.getItem('userId');
    this.currentYear = new Date().getFullYear();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.currentYear - 18);
    this.fetchRequerements();
    this.fetchSource();
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

  selectsource(sourceid: any, sourceName: any): void {
    this.sourceId = sourceid;
    this.sourceName = sourceName;
  }

  selectRequirement(requirement: any): void {
    console.log(requirement);

    if (this.selectedRequirementName !== requirement?.requestName && this.selectedRequirementId !== requirement?.requestId) {
      this.selectedRequirementName = requirement?.requestName;
      this.selectedRequirementId = requirement?.requestId;
      this.maxSalary = requirement?.requestMaxSalary
      this.minSalary = requirement?.requestBaseSalary
    }
  }

  onKeypress(event: any): void {
    let enteredValue: string;
    if (event.key === "Backspace") enteredValue = event.target.value.slice(0, -1);
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
    if (event.key === "Backspace") enteredValue = event.target.value.slice(0, -1);
    else enteredValue = event.target.value + event.key;
    const allowedCharacters: RegExp = /^[0-9]+$/;
    if (event.key !== "Backspace" && !allowedCharacters.test(enteredValue)) {
      event.preventDefault();
      return;
    }
    if (this.maxSalary === undefined) {
      this.tostr.warning(`Choose a Requirement`);
      return;
    }
    if (enteredValue && Number(enteredValue) >= this.maxSalary) this.tostr.warning(`Budget should be less than ${this.maxSalary}`);

  }



  dateChange(event: any): void {
    let date = new Date(event?.value);
    this.displayDate = this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  selectSkillType(type: any): void {
    this.selectedSkillType = type;
  }

  toggleSearchBar(): void {
    this.showSearchBar = !this.showSearchBar;
  }

  onFileSelected(event: any) {
    this.fileInputClicked = true;
    this.selectedFile = event.target.files[0];
    if (event.target.files.length > 0) this.resumeUploadSuccess = true;
  }

  submitClick(): void {
    let candidateDetails = this.candidateForm.value;
    this.primaryskills = this.selectedPrimarySkills.map(skill => skill.id);
    this.secondaryskills = this.selectedSecondarySkills.map(skill => skill.id);

    const formdata = new FormData();
    for (const key in candidateDetails) {
      if (candidateDetails[key]) formdata.append(key, candidateDetails[key]);
    }
    formdata.append('candidateCreatedby', this.candidateCreatedby);
    formdata.append('candidateResume', this.selectedFile);
    formdata.append('candidatePrimarySkills', this.primaryskills);
    formdata.append('candidateSecondarySkills', this.secondaryskills);
    formdata.append('resumeSourceId', this.sourceId);
    formdata.append('candidatesAddingAgainst', this.selectedRequirementId);

    if (this.candidateForm.value.candidateFirstName && this.candidateForm.value.candidateLastName && this.candidateForm.value.candidateGender
      && this.candidateForm.value.candidateEmail && this.candidateForm.value.candidateMobileNo) {
      this.validationSuccess = true;
    } else this.tostr.warning('Please fill all mandatory fields');
    if (this.validationSuccess) {
      this.apiService.post(`/candidate/create`, formdata).subscribe({
        next: (response) => {
          this.tostr.success('Candidate created successfully');
          this.resetFormAndState();
        },
        error: (error) => {
          if (error?.status === 500) {
            this.tostr.error("Internal Server Error");
          } else {
            this.tostr.warning(error?.error?.message ? error?.error?.message : "Unable to create candidate");
          }
        },
      });
    } else this.submitted = true;
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
    this.showDropdown = false;
    this.showSource = false;
    this.showSearchBar = false;
    this.resumeUploadSuccess = false;
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

}
