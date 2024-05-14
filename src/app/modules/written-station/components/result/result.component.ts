import { HttpClient } from '@angular/common/http';
import { Component, Inject ,Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environments';
import { ApiService } from 'src/app/services/api.service';
import { ToastrServices } from 'src/app/services/toastr.service';
import { S3Service } from 'src/app/services/s3.service';
@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent {
  @Output() scoreSubmitted = new EventEmitter<number>();
  examServiceId;
  scoreValue: string = '';
  descriptionValue: string = '';
  fileInputClicked: boolean = false;
  selectedFile: any;
  resumeUploadSuccess: boolean = false;
  submitForm:boolean = false;
  constructor(private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,private apiService:ApiService,private tostr:ToastrServices,private s3Service:S3Service,
    private dialogRef: MatDialogRef<ResultComponent>) {if (data){
      this.examServiceId = data.candidateIds
    } 
  }


  ngOnInit(): void { }

   
  uploadFile():void{
    if (this.selectedFile) this.s3Service.uploadImage(this.selectedFile, 'hr-service-images', this.selectedFile);
  }

  submitClick(): void {
    this.uploadFile();
    const scoreElement = document.getElementById('score') as HTMLInputElement;
    if (scoreElement) this.scoreValue = scoreElement.value;
    const descriptionElement = document.getElementById('description') as HTMLInputElement;
    if (descriptionElement) this.descriptionValue = descriptionElement.value;
    const formdata = new FormData;
    formdata.append('examScore',this.scoreValue);
    formdata.append('examServiceId',this.examServiceId);
    formdata.append('examDescription',this.descriptionValue);
    if(this.selectedFile) formdata.append('file',this.selectedFile);
    
    let payload = {
      examScore: this.scoreValue,
      examServiceId: this.examServiceId,
      examDescription: this.descriptionValue
    }
    if(this.scoreValue && this.examServiceId && this.descriptionValue){
      this.submitForm = true;
      this.apiService.post(`/written-station/result`, formdata).subscribe((res: any) => {
        this.dialogRef.close(true);
        this.scoreSubmitted.emit(parseInt(this.scoreValue, 10));
      }, err => {
        this.dialogRef.close();
        if (err?.status === 500) this.tostr.error("Internal Server Error")
        else this.tostr.warning(err?.error?.message ? err?.error?.message : "Cannot update Result")
      });
    }else this.tostr.warning('Please fill all the fields before submit')
  }
  
  cancelClick(): void {
    this.dialogRef.close(false);
  }

  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
    fileInput.click();
  }

  onFileSelected(event: any) {
    this.fileInputClicked = true;
    this.selectedFile = event.target.files[0];
    if (event.target.files.length > 0) this.resumeUploadSuccess = true;
  }
}


