import { Component, OnInit ,ViewChild} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from '@angular/material/dialog';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ElementRef } from '@angular/core';
import { environment } from 'src/environments/environments';
@Component({
  selector: 'app-add-candidate-modal',
  templateUrl: './add-candidate-modal.component.html',
  styleUrls: ['./add-candidate-modal.component.css']
})
export class AddCandidateModalComponent implements OnInit {
  matcher: ErrorStateMatcher = new ShowOnDirtyErrorStateMatcher();
  candidateForm!: UntypedFormGroup;
  submitted: boolean = false;
  fileValue: any;
  fileInputClicked: boolean = false;
  selectedFile: any;
  skillTypes: string[] = ['Primary Skills', 'Secondary Skills'];
  selectedSkillType: any;
  skillSuggestions: any[] = [];
  selectedPrimarySkills: any[] = [];
  selectedSecondarySkills: any[] = [];
  skillName:any;
  selectedSkill:any;
  showSearchBar:boolean = false;
  skillsuggestionbox:boolean = false;
  primaryskills:any;
  secondaryskills:any;
  searchvalue:any;
  // @ViewChild('skillSearchBar') skillSearchBar!: ElementRef;
  constructor(private formBuilder: UntypedFormBuilder, private dialogRef: MatDialogRef<AddCandidateModalComponent>, private http: HttpClient) {
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
     
      
     
    })
  }
  ngOnInit(): void {

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
        // console.log("candidateDetails[key]",key);
        
      }
    }
    formdata.append('candidateResume', this.selectedFile);
    formdata.append('candidatePrimarySkills',this.primaryskills);
    formdata.append('candidateSecondarySkills',this.secondaryskills)
    // formdata.append('details', JSON.stringify(candidateDetails));
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
      this.dialogRef.close();
    } else {
      this.submitted = true;
      this.dialogRef.close();
    }

  }


  triggerFileInput() {
    // console.log("file input");
    const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
    fileInput.click();
    if (fileInput) {

      // console.log("file input click works");

    }
  }

  cancel() {
    this.dialogRef.close();
  }

  onSkillTypeSelected(skillType: any) {
    // console.log("asdfg");
    this.selectedSkillType = skillType.value;
    // console.log("this.selectedSkillType", this.selectedSkillType);
    // this.skillSuggestions = [];
    
  }
  

  getSkillSuggestions(event:any) {
    // const searchQuery = this.selectedSkillType;
  this.searchvalue = event?.target.value;
  // console.log(" this.searchvalue", this.searchvalue);
  
    if (this.selectedSkillType) {
      const apiUrl = `${environment.api_url}/candidate/skills/list?q=${this.selectedSkillType}`;
      this.http.get(apiUrl).subscribe((res: any) => {
        this.skillSuggestions = res.data.filter((suggestion: any) =>
        suggestion.skillName.toLowerCase().startsWith(this.searchvalue.toLowerCase()) && !this.isSkillSelected(suggestion)
      );
        // console.log("this.skillSuggestions",this.skillSuggestions);
        
      });
    }
  }

  isSkillSelected(suggestion: any): boolean {
    const allSelectedSkills = [...this.selectedPrimarySkills, ...this.selectedSecondarySkills];
    return allSelectedSkills.some(selectedSkill => selectedSkill.id === suggestion.id);
  }

  selectSkill(suggestion: any) {
    // console.log("selectSkill(suggestion: any) ");
    
    const selectedSkill = { id: suggestion.id, name: suggestion.skillName };
    // console.log("selectedSkill",selectedSkill);

    if (this.selectedSkillType === 'Primary Skills') {
      this.selectedPrimarySkills.push(selectedSkill);
      // console.log(" this.selectedPrimarySkills", this.selectedPrimarySkills);
      
    } else if (this.selectedSkillType === 'Secondary Skills') {
      this.selectedSecondarySkills.push(selectedSkill);
      // console.log(" this.selectedSecondarySkills", this.selectedSecondarySkills);
      
    }
    // console.log("selectedSkill",selectedSkill);
    this.showSearchBar = false; 
    this.skillSuggestions = [];
  }
  
  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;
   
  }
  
  
}
