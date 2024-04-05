import { DatePipe } from '@angular/common';
import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { ToastrServices } from 'src/app/services/toastr.service';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  public onEditSuccess: EventEmitter<void> = new EventEmitter<void>();
  displayDate: any
  showDropdown: boolean = false;
  showSource: boolean = false;
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
  resumeUploadSuccess: boolean = false;
  showPrimary: boolean = false;
  showSecondary: boolean = false;
  candidateId: any;
  CandidateData: any;
  candidateDetails: any;
  showGender: boolean = false;
  gender: any[] = ['Male', 'Female', 'Others'];
  genderName: any;
  constructor(public dialogRef: MatDialogRef<EditComponent>, private tostr: ToastrServices, private formBuilder: UntypedFormBuilder, private apiService: ApiService,
    private datePipe: DatePipe, @Inject(MAT_DIALOG_DATA) public data: any) {
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
      candidateAddress: [null, Validators.required],
      candidateemail: [null, Validators.required],
      candidateMobileNo: [null, Validators.required],
      resumeSourceId: [null, Validators.required],
      candidateId: [null, Validators.required]
    })
  }

  ngOnInit(): void {
    this.fetchCandidateDetails();
    this.fetchRequerements();
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
      this.sourceList = res.data;
    })
  }

  fetchRequerements(): void {
    this.apiService.get(`/service-request/list`).subscribe((res: any) => {
      this.requirementList = res.data;
    })
  }

  fetchCandidateDetails(): void {
    this.apiService.get(`/candidate/list/${this.data}`).subscribe((res: any) => {
      if (res?.data) {
        this.CandidateData = res?.data
        this.candidateDetails = res?.data[0];
        if (this.candidateDetails?.candidatePrimarySkills) {
          this.selectedPrimarySkills = this.candidateDetails?.candidatePrimarySkills.map((skill: any) => ({
            id: skill.skillType,
            name: skill.skillType
          }));
        }
        if (this.candidateDetails?.candidateSecondarySkills) {
          this.selectedSecondarySkills = this.candidateDetails?.candidateSecondarySkills.map((skill: any) => ({
            id: skill.skillType,
            name: skill.skillType
          }));
        }
        this.candidateForm.patchValue({
          candidateFirstName: this.candidateDetails?.candidateFirstName,
          candidateLastName: this.candidateDetails?.candidateLastName,
          candidateDoB: this.candidateDetails?.candidateDoB,
          candidateGender: this.candidateDetails.candidateGender,
          candidateExperience: this.candidateDetails?.candidateExperience,
          candidatePreviousOrg: this.candidateDetails?.candidatePreviousOrg,
          candidatePreviousDesignation: this.candidateDetails?.candidatePreviousDesignation,
          candidateEducation: this.candidateDetails?.candidateEducation,
          candidateCurrentSalary: this.candidateDetails?.candidateCurrentSalary,
          candidateExpectedSalary: this.candidateDetails?.candidateExpectedSalary,
          candidateAddress: this.candidateDetails?.candidateAddress,
          candidateemail: this.candidateDetails?.candidateEmail,
          candidateMobileNo: this.candidateDetails?.candidateMobileNo,
          resumeSourceId: this.candidateDetails?.resumeSourecd,
          candidateId: this.candidateDetails?.candidateId
        })
      }
    });
  }

  selectsource(sourceid: any, sourceName: any): void {
    this.sourceId = sourceid;
    this.sourceName = sourceName;
  }

  selectRequirement(id: any, name: any): void {
    if (this.selectedRequirementName !== name && this.selectedRequirementId !== id) {
      this.selectedRequirementName = name;
      this.selectedRequirementId = id;
    }
  }

  selectGender(item: any) {
    this.genderName = item;
  }

  dateChange(event: any): void {
    let date = new Date(event?.value);
    this.displayDate = this.datePipe?.transform(date, 'yyyy-MM-dd');
  }

  selectSkillType(type: any): void {
    this.selectedSkillType = type;
  }

  toggleSearchBarPrimary(): void {
    this.showPrimary = !this.showPrimary;
  }

  toggleSearchBarSecondary(): void {
    this.showSecondary = !this.showSecondary;
  }

  onFileSelected(event: any) {
    this.fileInputClicked = true;
    this.selectedFile = event?.target?.files[0];
    if (event.target.files.length > 0) this.resumeUploadSuccess = true;
  }

  submitClick(): void {
    let candidateDetails = this.candidateForm.value;
    this.primaryskills = this.selectedPrimarySkills.map(skill => skill.id);
    this.secondaryskills = this.selectedSecondarySkills.map(skill => skill.id);
    const formdata = new FormData();
    formdata.append('candidateId', this.candidateDetails?.candidateId);
    if (candidateDetails.candidateFirstName !== this.candidateDetails?.candidateFirstName) formdata.append('candidateFirstName', candidateDetails?.candidateFirstName);
    if (candidateDetails?.candidateLastName !== this.candidateDetails?.candidateLastName) formdata.append('candidateLastName', candidateDetails?.candidateLastName);
    if (candidateDetails?.candidateDoB !== this.candidateDetails?.candidateDoB) formdata.append('candidateDoB', candidateDetails?.candidateDoB);
    if (candidateDetails?.candidateGender !== this.candidateDetails?.candidateGender) formdata.append('candidateGender', candidateDetails?.candidateGender);
    if (candidateDetails?.candidateExperience !== this.candidateDetails?.candidateExperience) formdata.append('candidateExperience', candidateDetails?.candidateExperience);
    if (candidateDetails?.candidatePreviousOrg !== this.candidateDetails?.candidatePreviousOrg) formdata.append('candidatePreviousOrg', candidateDetails?.candidatePreviousOrg);
    if (candidateDetails?.candidatePreviousDesignation !== this.candidateDetails?.candidatePreviousDesignation) formdata.append('candidatePreviousDesignation', candidateDetails?.candidatePreviousDesignation);
    if (candidateDetails?.candidateEducation !== this.candidateDetails?.candidateEducation) formdata.append('candidateEducation', candidateDetails?.candidateEducation);
    if (candidateDetails?.candidateCurrentSalary !== this.candidateDetails?.candidateCurrentSalary) formdata.append('candidateCurrentSalary', candidateDetails?.candidateCurrentSalary);
    if (candidateDetails?.candidateExpectedSalary !== this.candidateDetails?.candidateExpectedSalary) formdata.append('candidateExpectedSalary', candidateDetails?.candidateExpectedSalary);
    if (candidateDetails?.candidateAddress !== this.candidateDetails?.candidateAddress) formdata.append('candidateEducation', candidateDetails?.candidateAddress);
    if (candidateDetails?.candidateemail !== this.candidateDetails?.candidateEmail) formdata.append('candidateemail', candidateDetails?.candidateemail);
    if (candidateDetails?.candidateMobileNo !== this.candidateDetails?.candidateMobileNo) formdata.append('candidateMobileNo', candidateDetails?.candidateMobileNo);
    if (this.sourceId) formdata.append('resumeSourceId', this.sourceId);
    if (this.selectedFile) formdata.append('candidateResume', this.selectedFile);
    if (this.primaryskills.length > 0) formdata.append('candidatePrimarySkills', this.primaryskills);
    if (this.secondaryskills.length > 0) formdata.append('candidateSecondarySkills', this.secondaryskills);
    if (this.selectedRequirementId) formdata.append('candidatesAddingAgainst', this.selectedRequirementId);
    if (this.genderName) formdata.append('candidateGender', this.genderName);
    if (this.candidateForm.value.candidateFirstName && this.candidateForm.value.candidateLastName && this.candidateForm.value.candidateGender
      && this.candidateForm.value.candidateemail && this.candidateForm.value.candidateMobileNo) {
      this.validationSuccess = true;
    } else this.tostr.warning('Please fill all mandatory fields');
    if (this.validationSuccess) {
      this.apiService.post(`/candidate/edit`, formdata).subscribe((response) => {
        this.tostr.success('Candidate updated successfully');
        this.onEditSuccess.emit();
        this.dialogRef.close();
      },
        (error) => {
          if (error?.status === 500) this.tostr.error("Internal Server Error")
          else this.tostr.warning(error?.error?.message ? error?.error?.message : "Unable to create candidate");    
        }
      );
    } else this.submitted = true;
  }

  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
    fileInput.click();
  }

  cancel() {
    this.dialogRef.close();
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
    this.apiService.get(`/candidate/skills/list?search=${this.searchvalue}`).subscribe((res: any) => {
      this.skillSuggestions = res.data.filter((suggestion: any) =>
        suggestion.skillName.toLowerCase().startsWith(this.searchvalue.toLowerCase()) && !this.isSkillSelected(suggestion)
      );
    });
  }

  removeSkill(skillToRemove: any, type: 'primary' | 'secondary'): void {
    if (type === 'primary') this.selectedPrimarySkills = this.selectedPrimarySkills.filter(skill => skill.id !== skillToRemove.id);
    else if (type === 'secondary') this.selectedSecondarySkills = this.selectedSecondarySkills.filter(skill => skill.id !== skillToRemove.id);  
  }

  isSkillSelected(suggestion: any): boolean {
    const allSelectedSkills = [...this.selectedPrimarySkills, ...this.selectedSecondarySkills];
    return allSelectedSkills.some(selectedSkill => selectedSkill.id === suggestion.id);
  }

  selectSkill(suggestion: any, skillType: any): void {
    const selectedSkill = { id: suggestion.id, name: suggestion.skillName };
    if (skillType === 'primary') this.selectedPrimarySkills.push(selectedSkill);
    else if (skillType === 'secondary') this.selectedSecondarySkills.push(selectedSkill);
    this.showSearchBar = false;
    this.skillSuggestions = [];
  }
}
