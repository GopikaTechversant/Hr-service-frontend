import { HttpClient } from '@angular/common/http';
import { Component, Inject ,Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environments';
import { ApiService } from 'src/app/services/api.service';
import { ToastrServices } from 'src/app/services/toastr.service';
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
  constructor(private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,private apiService:ApiService,private tostr:ToastrServices,
    private dialogRef: MatDialogRef<ResultComponent>) {if (data){
      this.examServiceId = data.candidateIds
    } 
    this.dialogRef.updateSize('30%', '40%')
  }


  ngOnInit(): void { }

  submitClick(): void {
    const scoreElement = document.getElementById('score') as HTMLInputElement;
    if (scoreElement) this.scoreValue = scoreElement.value;
    const descriptionElement = document.getElementById('description') as HTMLInputElement;
    if (descriptionElement) this.descriptionValue = descriptionElement.value;
    let payload = {
      examScore: this.scoreValue,
      examServiceId: this.examServiceId,
      examDescription: this.descriptionValue
    }

    this.apiService.post(`/written-station/result`, payload).subscribe((res: any) => {
      this.dialogRef.close(true);
      this.scoreSubmitted.emit(parseInt(this.scoreValue, 10));
    }, err => {
      this.dialogRef.close();
      if (err?.status === 500) this.tostr.error("Internal Server Error")
      else this.tostr.warning(err?.error?.message ? err?.error?.message : "Cannot update Result")
    });

  }
  
  cancelClick(): void {
    this.dialogRef.close(false);
  }
}


