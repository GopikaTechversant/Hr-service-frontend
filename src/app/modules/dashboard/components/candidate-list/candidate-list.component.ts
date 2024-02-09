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
  candidateList: any;
  searchQuery: any = {
    searchWord: '',
    page: 1,
    limit: 25,
  };
  currentPag: number = 1;
  currentLimit: number = 7;
  totalCount: any;
  data: any;
  list: any = [
    {
      name: 'Amritha',
      position: 'TL-.NET',
      experience: 6,
      currentCompany: 'abcd',
      location: 'tvm',
      noticeperiod: 60,
      dateTime: '12,12,2000 3.00 PM',
      panel: 'Arun Antony',
      mode: 'Gmeet'
    },
    {
      name: 'Amritha',
      position: 'TL-.NET',
      experience: 6,
      currentCompany: 'abcd',
      location: 'tvm',
      noticeperiod: 60,
      dateTime: '12,12,2000 3.00 PM',
      panel: 'Arun Antony',
      mode: 'Gmeet'
    },
    {
      name: 'Amritha',
      position: 'TL-.NET',
      experience: 6,
      currentCompany: 'abcd',
      location: 'tvm',
      noticeperiod: 60,
      dateTime: '12,12,2000 3.00 PM',
      panel: 'Arun Antony',
      mode: 'Gmeet'
    },
    {
      name: 'Amritha',
      position: 'TL-.NET',
      experience: 6,
      currentCompany: 'abcd',
      location: 'tvm',
      noticeperiod: 60,
      dateTime: '12,12,2000 3.00 PM',
      panel: 'Arun Antony',
      mode: 'Gmeet'
    },
    {
      name: 'Amritha',
      position: 'TL-.NET',
      experience: 6,
      currentCompany: 'abcd',
      location: 'tvm',
      noticeperiod: 60,
      dateTime: '12,12,2000 3.00 PM',
      panel: 'Arun Antony',
      mode: 'Gmeet'
    },
    {
      name: 'Amritha',
      position: 'TL-.NET',
      experience: 6,
      currentCompany: 'abcd',
      location: 'tvm',
      noticeperiod: 60,
      dateTime: '12,12,2000 3.00 PM',
      panel: 'Arun Antony',
      mode: 'Gmeet'
    },
  ]
  constructor(private http: HttpClient, private router: Router) { }
  ngOnInit(): void {
    this.fetchCandidates('');
  }

  fetchCandidates(searchKey: string): void {
    this.searchQuery.searchWord = searchKey;
    this.http.get(`${environment.api_url}/candidate/list?search=${this.searchQuery.searchWord}&page=${this.searchQuery.page}&limit=${this.searchQuery.limit}`)
      .subscribe((data: any) => {
        this.data = data;
        this.candidateList = [];
        this.candidateList = data?.candidates;
        this.totalCount = data?.candidateCount;
        console.log(this.data);
        
      });
  }
  navigate(path: any, queryParam: any): void {
    if (queryParam) this.router.navigate([path], { queryParams: { type: queryParam } });
    else this.router.navigate([path]);
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, false);
  }

  pageChange(event: any): void {
    let skip = parseInt(event, 10);
    this.currentPag = skip;
  }

}
