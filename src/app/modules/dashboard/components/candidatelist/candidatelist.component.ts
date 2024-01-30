import { Component ,OnInit} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { CandidateDetailsComponent } from '../candidate-details/candidate-details.component';
import { environment } from 'src/environments/environments';
import { Router } from '@angular/router';
@Component({
  selector: 'app-candidatelist',
  templateUrl: './candidatelist.component.html',
  styleUrls: ['./candidatelist.component.css']
})
export class CandidatelistComponent implements OnInit{
  candidates: any;
  searchQuery: string = '';
  constructor(private http: HttpClient,private dialog: MatDialog,private router: Router){}
  ngOnInit(): void {
  
    this.fetchCandidates('');
  }
 
  candidateSearch(): void {
    this.fetchCandidates(this.searchQuery);
  }

  fetchCandidates(searchQuery: string): void {
    // console.log("searchQuery",searchQuery);
    
    this.http.get(`${environment.api_url}/candidate/list?search=${searchQuery}`)
      .subscribe((data: any) => {
        this.candidates = data.candidates;
        console.log("this.candidates",this.candidates);
        
      });
  }

  openCandidateDetails(candidateId:any): void{
    this.http.get(`${environment.api_url}/candidate/list/${candidateId}`).subscribe((res) =>{
    // console.log("candidate id res",candidateId);
    
  })
    const dialogRef = this.dialog.open(CandidateDetailsComponent,{
      width :'900px',
      data : { candidateId: candidateId } 
    });
    dialogRef.afterClosed().subscribe(result =>{
      // console.log("after closed");
      
    })
  }
  
}
