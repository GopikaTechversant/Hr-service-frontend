import { Component ,Inject ,OnInit} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';
@Component({
  selector: 'app-candidate-details',
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.css']
})
export class CandidateDetailsComponent implements OnInit{
  candidateId:any;
  candidateDetails:any;
  resumePath:any;
constructor(@Inject(MAT_DIALOG_DATA) public data: any,private http: HttpClient){
  // console.log('Received candidateId:', data.candidateId);
}
ngOnInit(): void {
  this.candidateId = this.data.candidateId;
  this.http.get(`${environment.api_url}/candidate/list/${this.candidateId}`).subscribe((res) =>{
   
    this.candidateDetails = res;
    // console.log("candidate id res",   this.candidateDetails);
    
  })
}

viewResume(resume:any){
  this.resumePath = resume;
  // console.log("resume path",this.resumePath);
  // return this.resumePath.
  
}

}
