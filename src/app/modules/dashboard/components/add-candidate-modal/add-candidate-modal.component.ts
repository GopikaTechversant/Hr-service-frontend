import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from '@angular/material/dialog';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  constructor(private formBuilder: UntypedFormBuilder, private dialogRef: MatDialogRef<AddCandidateModalComponent>, private http: HttpClient) {
    this.candidateForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      dob: [null, Validators.required],
      experience: [null, Validators.required],
      previousOrg: [null, Validators.required],
      previousDesignation: [null, Validators.required],
      education: [null, Validators.required],
      currentSalary: [null, Validators.required],
      expectedSalary: [null, Validators.required],
      address: [null, Validators.required],
      createdby: [null, Validators.required],
      email: [null, Validators.required],
      mobileNo: [null, Validators.required],
     
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
    console.log("candidateDetails", candidateDetails);
    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data'

    });

    console.log("this.selectedFile", this.selectedFile);
    const formdata = new FormData();
    formdata.append('file', this.selectedFile);
    formdata.append('details', JSON.stringify(candidateDetails));
    console.log("Formdata final value", formdata)

    if (this.candidateForm) {
      this.http.post('http://ec2-52-195-172-72.ap-northeast-1.compute.amazonaws.com:3001/candidate/create', formdata, { headers }).subscribe(
        (response) => {
          console.log('File uploaded successfully:', response);
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
    } else {
      this.submitted = true;
      this.dialogRef.close();
    }

  }


  triggerFileInput() {
    console.log("file input");
    const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
    fileInput.click();
    if (fileInput) {

      console.log("file input click works");

    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
