import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-resubmission-modal',
  templateUrl: './resubmission-modal.component.html',
  styleUrls: ['./resubmission-modal.component.css']
})
export class ResubmissionModalComponent {
  constructor(public dialogRef: MatDialogRef<ResubmissionModalComponent>, @Inject(MAT_DIALOG_DATA) 
  public data: any,
  private apiService : ApiService) {

  }

  cancelClick(): void{

  }

  reloadClick():void{
    
  }
}
