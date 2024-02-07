import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css']
})
export class CandidateListComponent {
  candidateList : any = [];
  searchQuery: string = '';

  constructor(private http: HttpClient, private router: Router) { }
  ngOnInit(): void {
    this.fetchCandidates('');
  }

  fetchCandidates(searchQuery: string): void {

    this.http.get(`${environment.api_url}/candidate/list?search=${searchQuery}`)
      .subscribe((data: any) => {
        this.candidateList = data.candidates;
      });
  }
  navigate(path: any, queryParam: any): void {
    if (queryParam) this.router.navigate([path], { queryParams: { type: queryParam } });
    else this.router.navigate([path]);
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, false);
  }

}
