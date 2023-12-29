import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from '@angular/material/dialog';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-requirements-form-modal',
  templateUrl: './requirements-form-modal.component.html',
  styleUrls: ['./requirements-form-modal.component.css']
})
export class RequirementsFormModalComponent implements OnInit{
  requirementForm!: UntypedFormGroup;
  constructor(private formBuilder: UntypedFormBuilder){
    this.requirementForm = this.formBuilder.group({
      serviceServiceRequst: [null, Validators.required],
      serviceServiceId: [null, Validators.required],
      serviceCandidates: [null, Validators.required],
      serviceAssignee: [null, Validators.required],
      serviceDate: [null, Validators.required],
    })
  }
  ngOnInit(): void {
    
  }
}
