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
constructor(private http: HttpClient){}
ngOnInit(): void {
  this.http.get(`${environment.api_url}/candidate/list/jerom3@gmail.com`).subscribe((res: any) => {
    this.candidateDetails = res;    
  })
}

viewResume(resume:any){
  this.resumePath = resume;
  window.open(`${environment.api_url}${this.resumePath}`, '_blank'); 
}

}
