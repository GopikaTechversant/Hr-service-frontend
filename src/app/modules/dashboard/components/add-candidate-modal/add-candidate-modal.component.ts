import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from '@angular/material/dialog';
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
  constructor(private datePipe: DatePipe, private http: HttpClient) {

  }
  // matcher: ErrorStateMatcher = new ShowOnDirtyErrorStateMatcher();
  // candidateForm!: UntypedFormGroup;
  // submitted: boolean = false;
  // fileValue: any;
  // fileInputClicked: boolean = false;
  // selectedFile: any;
  skillTypes: string[] = ['Primary Skills', 'Secondary Skills'];
  selectedSkillType: any;
  skillSuggestions: any[] = [];
  selectedPrimarySkills: any[] = [];
  selectedSecondarySkills: any[] = [];
  // skillName: any;
  // selectedSkill: any;
  showSearchBar: boolean = false;
  // skillsuggestionbox: boolean = false;
  // primaryskills: any;
  // secondaryskills: any;
  searchvalue: any;

  // constructor(private formBuilder: UntypedFormBuilder, private dialogRef: MatDialogRef<AddCandidateModalComponent>, private http: HttpClient) {
  //   this.candidateForm = this.formBuilder.group({
  //     candidateFirstName: [null, Validators.required],
  //     candidateLastName: [null, Validators.required],
  //     candidateDoB: [null, Validators.required],
  //     candidateExperience: [null, Validators.required],
  //     candidatePreviousOrg: [null, Validators.required],
  //     candidatePreviousDesignation: [null, Validators.required],
  //     candidateEducation: [null, Validators.required],
  //     candidateCurrentSalary: [null, Validators.required],
  //     candidateExpectedSalary: [null, Validators.required],
  //     candidateAddress: [null, Validators.required],
  //     candidateCreatedby: [null, Validators.required],
  //     candidateEmail: [null, Validators.required],
  //     candidateMobileNo: [null, Validators.required],
  //   })
  // }
  ngOnInit(): void {
    // this.http.get(`${environment.api_url}/candidate/skills/list?q=${this.selectedSkillType}`).subscribe((res:any) => {
    //   console.log("ehguie",res);

    // })
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
  // onFileSelected(event: any) {
  //   this.fileInputClicked = true;
  //   this.selectedFile = event.target.files[0];
  // }


  // submitClick() {
  //   let candidateDetails = this.candidateForm.value;
  //   this.primaryskills = this.selectedPrimarySkills.map(skill => skill.id);
  //   this.secondaryskills = this.selectedSecondarySkills.map(skill => skill.id);
  //   console.log("candidateDetails", candidateDetails);
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'multipart/form-data'

  //   });

  //   console.log("this.selectedFile", this.selectedFile);

  //   const formdata = new FormData();
  //   for (const key in candidateDetails) {
  //     if (candidateDetails[key]) {
  //       formdata.append(key, candidateDetails[key]);


  //     }
  //   }
  //   formdata.append('candidateResume', this.selectedFile);
  //   formdata.append('candidatePrimarySkills', this.primaryskills);
  //   formdata.append('candidateSecondarySkills', this.secondaryskills)

  //   console.log("Formdata final value", formdata)

  //   if (this.candidateForm) {
  //     this.http.post(`${environment.api_url}/candidate/create`, formdata).subscribe(
  //       (response) => {
  //         console.log('File uploaded successfully:', response);
  //       },
  //       (error) => {
  //         console.error('Error uploading file:', error);
  //       }
  //     );
  //     this.dialogRef.close();
  //   } else {
  //     this.submitted = true;
  //     this.dialogRef.close();
  //   }

  // }


  triggerFileInput() {

    const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
    fileInput.click();
  }

  // cancel() {
  //   this.dialogRef.close();
  // }

  // onSkillTypeSelected(skillType: any) {

  //   this.selectedSkillType = skillType.value;


  // }


  getSkillSuggestions(event: any) {
    this.searchvalue = event?.target.value;
    if (this.selectedSkillType) {
      // const apiUrl = `${environment.api_url}/candidate/skills/list?q=${this.selectedSkillType}`;
      this.http.get(`${environment.api_url}/candidate/skills/list`).subscribe((res: any) => {
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
    } else if (this.selectedSkillType === 'Secondary Skills') {
      this.selectedSecondarySkills.push(selectedSkill);
    }
    this.showSearchBar = false;
    this.skillSuggestions = [];
  }
}
