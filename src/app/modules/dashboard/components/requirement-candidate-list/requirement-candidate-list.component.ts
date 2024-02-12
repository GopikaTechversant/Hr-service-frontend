import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';
@Component({
  selector: 'app-requirement-candidate-list',
  templateUrl: './requirement-candidate-list.component.html',
  styleUrls: ['./requirement-candidate-list.component.css']
})
export class RequirementCandidateListComponent implements OnInit {
  candidates_list: any = [];
  constructor(private http: HttpClient, private router: Router) { }
  ngOnInit(): void {
    this.fetchcandidates();
  }
  fetchcandidates(): void {
    this.http.get(`${environment.api_url}/screening-station/v1/list-all`).subscribe((res: any) => {
      console.log("fetch candidates", res);
      this.candidates_list = res.candidates;
      console.log("this.candidates_list", this.candidates_list);

    })
  }
  candidateSearch(): void {
  }
  navigate(path: any, requestId?: any): void {
    console.log("clicked");
    const queryParams = requestId ? { requestId: requestId } : undefined;
    if (queryParams) {
      this.router.navigate([path], { queryParams: queryParams });
    } else {
      this.router.navigate([path]);
    }
  }
}
