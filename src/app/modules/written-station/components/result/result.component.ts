import { HttpClient } from '@angular/common/http';
import { Component, Inject ,Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environments';

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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ResultComponent>
  ) {
    if (data) this.examServiceId = data
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


    this.http.post(`${environment.api_url}/written-station/result`, payload).subscribe((res: any) => {
      this.dialogRef.close(true);
      this.scoreSubmitted.emit(parseInt(this.scoreValue, 10));
    });

  }
  
  cancelClick(): void {
    this.dialogRef.close(false);
  }
}


