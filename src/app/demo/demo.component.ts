import { Component } from '@angular/core';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent {

}


// import { Component, OnInit ,ViewChild} from '@angular/core';
// import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
// import { MatDialogRef } from '@angular/material/dialog';
// import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { ElementRef } from '@angular/core';

// @Component({
//   selector: 'app-add-candidate-modal',
//   templateUrl: './add-candidate-modal.component.html',
//   styleUrls: ['./add-candidate-modal.component.css']
// })
// export class AddCandidateModalComponent implements OnInit {
//   matcher: ErrorStateMatcher = new ShowOnDirtyErrorStateMatcher();
//   candidateForm!: UntypedFormGroup;
//   submitted: boolean = false;
//   fileValue: any;
//   fileInputClicked: boolean = false;
//   selectedFile: any;
//   skillTypes: string[] = ['Primary Skills', 'Secondary Skills'];
//   selectedSkillType: any;
//   skillSuggestions: any[] = [];
//   selectedPrimarySkills: any[] = [];
//   selectedSecondarySkills: any[] = [];
//   skillName:any;
//   selectedSkill:any;
//   showSearchBar:boolean = false;
//   // @ViewChild('skillSearchBar') skillSearchBar!: ElementRef;
//   constructor(private formBuilder: UntypedFormBuilder, private dialogRef: MatDialogRef<AddCandidateModalComponent>, private http: HttpClient) {
//     this.candidateForm = this.formBuilder.group({
//       candidateFirstName: [null, Validators.required],
//       candidateLastName: [null, Validators.required],
//       candidateDoB: [null, Validators.required],
//       candidateExperience: [null, Validators.required],
//       candidatePreviousOrg: [null, Validators.required],
//       candidatePreviousDesignation: [null, Validators.required],
//       candidateEducation: [null, Validators.required],
//       candidateCurrentSalary: [null, Validators.required],
//       candidateExpectedSalary: [null, Validators.required],
//       candidateAddress: [null, Validators.required],
//       candidateCreatedby: [null, Validators.required],
//       candidateEmail: [null, Validators.required],
//       candidateMobileNo: [null, Validators.required],
//       candidatePrimarySkills: [null, Validators.required],
//       candidateSecondarySkills: [null, Validators.required],
      
     
//     })
//   }
//   ngOnInit(): void {

//   }

//   onFileSelected(event: any) {
//     this.fileInputClicked = true;
//     this.selectedFile = event.target.files[0];
//   }


//   submitClick() {
//     let candidateDetails = this.candidateForm.value;
//     candidateDetails.candidatePrimarySkills = this.selectedPrimarySkills.map(skill => skill.id);
//   candidateDetails.candidateSecondarySkills = this.selectedSecondarySkills.map(skill => skill.id);
//     console.log("candidateDetails", candidateDetails);
//     const headers = new HttpHeaders({
//       'Content-Type': 'multipart/form-data'

//     });

//     console.log("this.selectedFile", this.selectedFile);
    
//     const formdata = new FormData();
//     for (const key in candidateDetails) {
//       if (candidateDetails[key]) {
//         formdata.append(key, candidateDetails[key]);
//         // console.log("candidateDetails[key]",key);
        
//       }
//     }
//     formdata.append('candidateResume', this.selectedFile);
//     // formdata.append('details', JSON.stringify(candidateDetails));
//     console.log("Formdata final value", formdata)

//     if (this.candidateForm) {
//       this.http.post('http://ec2-52-195-172-72.ap-northeast-1.compute.amazonaws.com:3001/candidate/create', formdata).subscribe(
//         (response) => {
//           console.log('File uploaded successfully:', response);
//         },
//         (error) => {
//           console.error('Error uploading file:', error);
//         }
//       );
//       this.dialogRef.close();
//     } else {
//       this.submitted = true;
//       this.dialogRef.close();
//     }

//   }


//   triggerFileInput() {
//     console.log("file input");
//     const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
//     fileInput.click();
//     if (fileInput) {

//       console.log("file input click works");

//     }
//   }

//   cancel() {
//     this.dialogRef.close();
//   }

//   onSkillTypeSelected(skillType: any) {
//     console.log("asdfg");
//     this.selectedSkillType = skillType;
//     console.log("this.selectedSkillType", this.selectedSkillType);
//     this.skillSuggestions = [];
//   }
  

//   getSkillSuggestions() {
//     const searchQuery = this.selectedSkillType;

//     if (searchQuery) {
//       const apiUrl = `http://ec2-52-195-172-72.ap-northeast-1.compute.amazonaws.com:3001/candidate/skills/list?q=${searchQuery}`;
//       this.http.get(apiUrl).subscribe((res: any) => {
//         this.skillSuggestions = res.data;
//         console.log("this.skillSuggestions",this.skillSuggestions);
        
//       });
//     }
//   }

//   addSelectedSkill(suggestion: any) {
//     const skillField = (this.selectedSkillType === 'Primary Skills') ? 'candidatePrimarySkills' : 'candidateSecondarySkills';
//     this.candidateForm.get(skillField)?.setValue(suggestion.id);
//     this.selectedSkill = suggestion;
//     // this.skillSearchBar.nativeElement.innerHTML = suggestion.skillName;
//     this.skillSuggestions = []; // Clear suggestions after adding the skill
//   }
  
  
//   toggleSearchBar(){
//     this.showSearchBar = true;
//   }
  
// }
