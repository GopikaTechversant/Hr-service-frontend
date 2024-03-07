import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { Router } from '@angular/router';
@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css']
})
export class CandidateListComponent implements OnInit {
  candidates_list: any = [];
  searchQuery: string = '';
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.http.get(`${environment.api_url}/written-station/v1/list-all`).subscribe((res: any) => {
      this.candidates_list = res.candidates;
    })
  }

  navigate(path: any, requestId?: any): void {
    const queryParams = requestId ? { requestId: requestId } : undefined;
    if (queryParams) this.router.navigate([path], { queryParams: queryParams });
    else this.router.navigate([path]);
  }
  candidateSearch(){
    
  }
}
