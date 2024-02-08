import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environments';
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
  // fileValue: any;
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
  // skillName: any;
  // selectedSkill: any;
  showSearchBar: boolean = false;
  // skillsuggestionbox: boolean = false;
  primaryskills: any;
  secondaryskills: any;
  searchvalue: any;

  constructor(private formBuilder: UntypedFormBuilder, private http: HttpClient, private datePipe: DatePipe, private el: ElementRef) {
    this.candidateForm = this.formBuilder.group({
      candidateFirstName: [null, Validators.required],
      candidateLastName: [null, Validators.required],
      candidateDoB: [null, Validators.required],
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
      resumeSourceId:[null, Validators.required]
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
      console.log("source", res);
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
    console.log("selectedSkillType", this.selectedSkillType);

  }
  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;

  }
  onFileSelected(event: any) {
    this.fileInputClicked = true;
    this.selectedFile = event.target.files[0];
  }


  submitClick() {
    let candidateDetails = this.candidateForm.value;
    this.primaryskills = this.selectedPrimarySkills.map(skill => skill.id);
    this.secondaryskills = this.selectedSecondarySkills.map(skill => skill.id);
    console.log("candidateDetails", candidateDetails);
    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data'

    });

    console.log("this.selectedFile", this.selectedFile);

    const formdata = new FormData();
    for (const key in candidateDetails) {
      if (candidateDetails[key]) {
        formdata.append(key, candidateDetails[key]);


      }
    }
    formdata.append('candidateResume', this.selectedFile);
    formdata.append('candidatePrimarySkills', this.primaryskills);
    formdata.append('candidateSecondarySkills', this.secondaryskills);
    formdata.append('resumeSourceId',this.sourceId);
    console.log("Formdata final value", formdata)

    if (this.candidateForm) {
      this.http.post(`${environment.api_url}/candidate/create`, formdata).subscribe(
        (response) => {
          console.log('File uploaded successfully:', response);
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );

    } else {
      this.submitted = true;

    }

  }


  triggerFileInput() {

    const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
    fileInput.click();
  }

  cancel() {

  }



  getSkillSuggestions(event: any) {
    this.searchvalue = event?.target.value;
    console.log(" this.searchvalue ", this.searchvalue);

    if (this.selectedSkillType) {

      this.http.get(`${environment.api_url}/candidate/skills/list?search=${this.searchvalue}`).subscribe((res: any) => {
        console.log("res", res);

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

  selectSkill(suggestion: any) {
    const selectedSkill = { id: suggestion.id, name: suggestion.skillName };
    if (this.selectedSkillType === 'Primary Skills') {
      this.selectedPrimarySkills.push(selectedSkill);
      console.log("primary", this.selectedPrimarySkills);

    } else if (this.selectedSkillType === 'Secondary Skills') {
      this.selectedSecondarySkills.push(selectedSkill);
      console.log("this.selectedSecondarySkills", this.selectedSecondarySkills);

    }
    this.showSearchBar = false;
    this.skillSuggestions = [];
  }
}
