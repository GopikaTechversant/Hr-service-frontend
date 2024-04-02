import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environments';
import { HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit{
  public onDeleteSuccess:EventEmitter<void> = new EventEmitter<void>();
  candidateId:any;
  constructor(public dialogRef: MatDialogRef<DeleteComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private http:HttpClient){

  }
  ngOnInit(): void {    
  }

  cancel():void{
    this.dialogRef.close();
  }
  
  delete():void{
    this.candidateId = this.data;
    this.onDeleteSuccess.emit();
    this.dialogRef.close();
    // this.http.post(`${environment.api_url}/candidate/remove-candidate`,{ candidateId: this.candidateId }).subscribe((res:any) => {
    //   this.onDeleteSuccess.emit();
    //   this.dialogRef.close();
    // })
  }
}
