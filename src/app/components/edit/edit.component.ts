import { DatePipe } from '@angular/common';
import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { ToastrServices } from 'src/app/services/toastr.service';
import { S3Service } from 'src/app/services/s3.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environments';
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
  searchvalue: string = '';
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
  private keySubscription?: Subscription;
  uploadedFileKey: string = '';
  gender: any[] = ['Male', 'Female', 'Others'];
  genderName: any;
  resumePath: any;
  preferredLocation: any[] = [];
  locationname: any;
  locationListOpen: boolean = false;
  loader: boolean = false;
  file: any;
  fileName: any;
  candidateResume: any;
  constructor(public dialogRef: MatDialogRef<EditComponent>, private tostr: ToastrServices, private formBuilder: UntypedFormBuilder, private apiService: ApiService,
    private datePipe: DatePipe, @Inject(MAT_DIALOG_DATA) public data: any, private s3Service: S3Service) {
    this.candidateForm = this.formBuilder.group({
      candidateFirstName: [null, Validators.required],
      candidateLastName: [null, Validators.required],
      candidateDoB: [null, Validators.required],
      candidateGender: [null, Validators.required],
      candidateTotalExperience: [null, Validators.required],
      candidateRevlentExperience: [null, Validators.required],
      candidatePreviousOrg: [null, Validators.required],
      candidatePreviousDesignation: [null, Validators.required],
      candidateEducation: [null, Validators.required],
      candidateCurrentSalary: [null, Validators.required],
      candidateExpectedSalary: [null, Validators.required],
      candidateAddress: [null, Validators.required],
      candidateemail: [null, Validators.required],
      candidateMobileNo: [null, Validators.required],
      resumeSourceId: [null, Validators.required],
      candidateId: [null, Validators.required],
      candidateCity: [null, Validators.required],
      candidateDistrict: [null, Validators.required],
      candidateState: [null, Validators.required]
    })
  }

  ngOnInit(): void {
    this.fetchCandidateDetails();
    this.fetchRequerements();
    this.fetchLocation();
  }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.showDropdown = false;
      this.showSource = false;
      this.requirementListOpen = false;
      this.locationListOpen = false;
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

  fetchLocation(): void {
    this.apiService.get(`/user/preffer-location`).subscribe((res: any) => {
      this.preferredLocation = res?.data;
    })
  }

  fetchCandidateDetails(): void {
    this.apiService.get(`/candidate/list/${this.data}`).subscribe((res: any) => {
      if (res?.data) {
        this.CandidateData = res?.data
        this.candidateDetails = res?.data?.[0];
        this.candidateResume = this.candidateDetails?.candidateResume || "";
        if (this.candidateDetails?.candidatePrimarySkills) {
          this.selectedPrimarySkills = this.candidateDetails?.candidatePrimarySkills.map((skill: any) => ({
            id: skill.skillId,
            name: skill.skillType
          }));
        }
        if (this.candidateDetails?.candidateSecondarySkills) {
          this.selectedSecondarySkills = this.candidateDetails?.candidateSecondarySkills.map((skill: any) => ({
            id: skill.skillId,
            name: skill.skillType
          }));
        }
        this.candidateForm.patchValue({
          candidateFirstName: this.candidateDetails?.candidateFirstName,
          candidateLastName: this.candidateDetails?.candidateLastName,
          candidateDoB: this.candidateDetails?.candidateDoB,
          candidateGender: this.candidateDetails.candidateGender,
          candidatePreviousOrg: this.candidateDetails?.candidatePreviousOrg,
          candidatePreviousDesignation: this.candidateDetails?.candidatePreviousDesignation,
          candidateEducation: this.candidateDetails?.candidateEducation,
          candidateCurrentSalary: this.candidateDetails?.candidateCurrentSalary,
          candidateExpectedSalary: this.candidateDetails?.candidateExpectedSalary,
          candidateCity: this.candidateDetails?.candidateCity,
          candidateDistrict: this.candidateDetails?.candidateDistrict,
          candidateState: this.candidateDetails?.candidateState,
          candidateemail: this.candidateDetails?.candidateEmail,
          candidateMobileNo: this.candidateDetails?.candidateMobileNo,
          resumeSourceId: this.candidateDetails?.resumeSourecd,
          candidateId: this.candidateDetails?.candidateId,
          candidatePreferlocation: this.candidateDetails?.candidatePreferlocation,
          candidateTotalExperience: this.candidateDetails?.candidateTotalExperience,
          candidateRevlentExperience: this.candidateDetails?.candidateRevlentExperience
        })
      }
    });
  }

  removeResume(): void {
    this.candidateResume = '';
  }

  onFileSelected(event: any) {
    this.loader = true;
    this.fileInputClicked = true;
    this.selectedFile = event.target.files?.[0];
    this.loader = true;
    if (this.selectedFile) this.s3Service.uploadImage(this.selectedFile, 'hr-service-images', this.selectedFile);
    this.getKeyFroms3();
  }

  getKeyFroms3(): void {
    this.keySubscription = this.s3Service.key.subscribe((key: string) => {
      this.uploadedFileKey = key;
      if (!this.uploadedFileKey) {
        this.loader = false;
        this.tostr.error('Something Went Wrong Please Try Again');
        this.resumeUploadSuccess = true;
      } else {
        this.loader = false;
        this.tostr.success('File upload Successfully');
        this.candidateResume = this.uploadedFileKey;
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
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

  selectLocation(name: any): void {
    if (this.locationname !== name) this.locationname = name;

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

  submitClick(): void {
    const { candidateFirstName, candidateLastName, candidateDoB, candidateGender, candidateTotalExperience, candidateRevlentExperience, candidatePreviousOrg, candidatePreviousDesignation, candidateEducation, candidateCurrentSalary, candidateExpectedSalary, candidateAddress, candidateemail, candidateMobileNo, candidateCity, candidateDistrict, candidateState } = this.candidateForm.value;
  
    this.primaryskills = this.selectedPrimarySkills.map(skill => skill.id).filter(Boolean);
    this.secondaryskills = this.selectedSecondarySkills.map(skill => skill.id).filter(Boolean);
  
    const payload = {
      candidateId: this.candidateDetails?.candidateId,
      candidateFirstName: candidateFirstName !== this.candidateDetails?.candidateFirstName ? candidateFirstName : undefined,
      candidateLastName: candidateLastName !== this.candidateDetails?.candidateLastName ? candidateLastName : undefined,
      candidateDoB: candidateDoB !== this.candidateDetails?.candidateDoB ? candidateDoB : undefined,
      candidateGender: candidateGender !== this.candidateDetails?.candidateGender ? candidateGender : undefined,
      candidateTotalExperience: candidateTotalExperience !== this.candidateDetails?.candidateTotalExperience ? candidateTotalExperience : undefined,
      candidateRevlentExperience: candidateRevlentExperience !== this.candidateDetails?.candidateRevlentExperience ? candidateRevlentExperience : undefined,
      candidatePreviousOrg: candidatePreviousOrg !== this.candidateDetails?.candidatePreviousOrg ? candidatePreviousOrg : undefined,
      candidatePreviousDesignation: candidatePreviousDesignation !== this.candidateDetails?.candidatePreviousDesignation ? candidatePreviousDesignation : undefined,
      candidateEducation: candidateEducation !== this.candidateDetails?.candidateEducation ? candidateEducation : undefined,
      candidateCurrentSalary: candidateCurrentSalary !== this.candidateDetails?.candidateCurrentSalary ? candidateCurrentSalary : undefined,
      candidateExpectedSalary: candidateExpectedSalary !== this.candidateDetails?.candidateExpectedSalary ? candidateExpectedSalary : undefined,
      candidateAddress: candidateAddress !== this.candidateDetails?.candidateAddress ? candidateAddress : undefined,
      candidateEmail: candidateemail !== this.candidateDetails?.candidateEmail ? candidateemail : undefined,
      candidateMobileNo: candidateMobileNo !== this.candidateDetails?.candidateMobileNo ? candidateMobileNo : undefined,
      resumeSourceId: this.sourceId,
      candidateResume: this.candidateResume,
      candidatePrimarySkills: this.primaryskills.length ? this.primaryskills : undefined,
      candidateSecondarySkills: this.secondaryskills.length ? this.secondaryskills : undefined,
      genderName: this.genderName,
      candidatePreferlocation: this.locationname,
      candidateCity: candidateCity !== this.candidateDetails?.candidateCity ? candidateCity : undefined,
      candidateDistrict: candidateDistrict !== this.candidateDetails?.candidateDistrict ? candidateDistrict : undefined,
      candidateState: candidateState !== this.candidateDetails?.candidateState ? candidateState : undefined,
    };
  
    // Validation
    const mandatoryFieldsFilled = candidateFirstName && candidateLastName && candidateGender && candidateemail && candidateMobileNo;
    
    if (!mandatoryFieldsFilled) {
      this.tostr.warning('Please fill all mandatory fields');
      this.submitted = true;
      return;
    }
  
    // Submit the form if validation is successful
    this.apiService.post(`/candidate/edit`, payload).subscribe(
      (response) => {
        this.tostr.success('Candidate updated successfully');
        this.onEditSuccess.emit();
        this.dialogRef.close();
      },
      (error) => {
        const errorMessage = error?.error?.message || (error?.status === 500 ? 'Internal Server Error' : 'Unable to update candidate');
        this.tostr.error(errorMessage);
        this.dialogRef.close();
      }
    );
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

  getSkillSuggestions(event: any,type:string): void {
    this.searchvalue = event?.target.value;
    const Skilltype = type;
    this.apiService.get(`/candidate/skills/list?search=${this.searchvalue}`).subscribe((res: any) => {
      if(Skilltype === 'primary'){
        this.showPrimary = true;
        this.showSecondary = false;
      } 
      if(Skilltype === 'secondary'){
        this.showPrimary = false;
        this.showSecondary = true;
      } 
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
    const selectedSkill = { id: suggestion?.id, name: suggestion?.skillName };
    if (skillType === 'primary') this.selectedPrimarySkills.push(selectedSkill);
    else if (skillType === 'secondary') this.selectedSecondarySkills.push(selectedSkill);
    this.showSearchBar = false;
    this.skillSuggestions = [];
  }

  viewResume(resume: any) {
    this.resumePath = resume;
    window.open(`${environment.s3_url}${this.resumePath}`, '_blank');
  }

  ngOnDestroy(): void {
    if (this.keySubscription) {
      this.keySubscription.unsubscribe();
    }
  }
}
