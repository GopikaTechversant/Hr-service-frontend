import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environments';
import { ToastrServices } from 'src/app/services/toastr.service';
@Component({
  selector: 'app-add-candidate-modal',
  templateUrl: './add-candidate-modal.component.html',
  styleUrls: ['./add-candidate-modal.component.css'],
  providers: [DatePipe],
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
  sourceId: any;
  sourceName: any;
  showSearchBar: boolean = false;
  primaryskills: any;
  secondaryskills: any;
  searchvalue: any;
  validationSuccess: boolean = false;

  constructor(private tostr: ToastrServices, private formBuilder: UntypedFormBuilder, private http: HttpClient, private datePipe: DatePipe, private el: ElementRef) {
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
      candidateCreatedby: [null, Validators.required],
      candidateEmail: [null, Validators.required],
      candidateMobileNo: [null, Validators.required],
      resumeSourceId: [null, Validators.required]
    })
  }

  ngOnInit(): void {
    this.fetchSource();
  }

  @HostListener('document:click', ['$event'])
  onBodyClick(event: Event): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }

  fetchSource(): void {
    this.http.get(`${environment.api_url}/candidate/resume-source/list`).subscribe((res: any) => {
      this.sourceList = res.data;
    })
  }

  selectsource(sourceid: any, sourceName: any): void {
    this.showSource = false;
    this.sourceId = sourceid;
    this.sourceName = sourceName;
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
  }


  submitClick(): void {
    let candidateDetails = this.candidateForm.value;
    this.primaryskills = this.selectedPrimarySkills.map(skill => skill.id);
    this.secondaryskills = this.selectedSecondarySkills.map(skill => skill.id);
    console.log("candidateDetails", candidateDetails);
    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data'
    });
    const formdata = new FormData();
    for (const key in candidateDetails) {
      if (candidateDetails[key]) {
        formdata.append(key, candidateDetails[key]);
      }
    }

    formdata.append('candidateResume', this.selectedFile);
    formdata.append('candidatePrimarySkills', this.primaryskills);
    formdata.append('candidateSecondarySkills', this.secondaryskills);
    formdata.append('resumeSourceId', this.sourceId);
    if (this.candidateForm.value.candidateFirstName && this.candidateForm.value.candidateLastName && this.candidateForm.value.candidateGender
      && this.candidateForm.value.candidateEmail && this.candidateForm.value.candidateMobileNo) {
      this.validationSuccess = true;  
    }else  this.tostr.warning('Please fill all mandatory fields');

    if (this.validationSuccess) {
      this.http.post(`${environment.api_url}/candidate/create`, formdata).subscribe(
        (response) => {
          this.tostr.success('Candidate created successfully')
        },
        (error) => {
          if (error?.status === 500) this.tostr.error("Internal Server Error")
          else {
            this.tostr.error(error?.error?.error_message ? error?.error?.error_message : "Unable to create candidate");
          }
        }
      );
    } else {
      this.submitted = true;
    }
  }




  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
    fileInput.click();
  }

  cancel() {

  }

  getSkillSuggestions(event: any): void {
    this.searchvalue = event?.target.value;
    if (this.selectedSkillType) {
      this.http.get(`${environment.api_url}/candidate/skills/list?search=${this.searchvalue}`).subscribe((res: any) => {
        this.skillSuggestions = res.data.filter((suggestion: any) =>
          suggestion.skillName.toLowerCase().startsWith(this.searchvalue.toLowerCase()) && !this.isSkillSelected(suggestion)
        );
      });
    }
  }

  isSkillSelected(suggestion: any): boolean {
    const allSelectedSkills = [...this.selectedPrimarySkills, ...this.selectedSecondarySkills];
    return allSelectedSkills.some(selectedSkill => selectedSkill.id === suggestion.id);
  }

  selectSkill(suggestion: any): void {
    const selectedSkill = { id: suggestion.id, name: suggestion.skillName };
    if (this.selectedSkillType === 'Primary Skills') {
      this.selectedPrimarySkills.push(selectedSkill);
    } else if (this.selectedSkillType === 'Secondary Skills') {
      this.selectedSecondarySkills.push(selectedSkill);
    }
    this.showSearchBar = false;
    this.skillSuggestions = [];
  }

}
