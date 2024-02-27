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
  searchQuery: string = '';
  length: any = 20;
  pageSize = 6;
  pageIndex = 1;
  pageSizeOptions = [5, 10, 15, 20];
  showFirstLastButtons = true;
  constructor(private http: HttpClient, private router: Router) { }
  ngOnInit(): void {
    this.fetchcandidates('');
   
  }
  fetchcandidates(searchQuery: string): void {
    this.http.get(`${environment.api_url}/screening-station/v1/list-all?page=${this.pageIndex}&limit=${this.pageSize}&search=${searchQuery}`).subscribe((res: any) => {
      console.log("fetch candidates", res);
      this.candidates_list = res.candidates;
      console.log("this.candidates_list", this.candidates_list);
    })
  }
 
  candidateSearch(): void {
    this.fetchcandidates(this.searchQuery);
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
  handlePageEvent(event: any) {
    console.log("event", event);
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchcandidates('');
  }
}
