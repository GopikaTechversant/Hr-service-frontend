import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-requirement-candidate-list',
  templateUrl: './requirement-candidate-list.component.html',
  styleUrls: ['./requirement-candidate-list.component.css']
})
export class RequirementCandidateListComponent implements OnInit {
  candidates_list: any = [];
  searchKeyword: string = '';
  length: any = 20;
  limit = 9;
  currentPage = 1;
  showFirstLastButtons = true;
  totalCount: any;
  lastPage: any;
  initialLoader: boolean = false;
  loader: boolean = false;
  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
    this.initialLoader = true;
    this.fetchcandidates('');
  }

  fetchcandidates(searchQuery: string): void {
    if(!this.initialLoader) this.loader = true
    this.apiService.get(`/screening-station/v1/list-all?page=${this.currentPage}&limit=${this.limit}&search=${searchQuery.trim()}`).subscribe((res: any) => {
      if (res) {
        this.initialLoader = false;
        this.loader = false
        this.candidates_list = res?.candidates;
        this.totalCount = res?.totalCount;
        const totalPages = Math.ceil(this.totalCount / this.limit);
        this.lastPage = totalPages;
        if (this.currentPage > totalPages) this.currentPage = totalPages;
      }
    })
  }

  generatePageNumbers() {
    let pages = [];
    if (this.lastPage <= 5) {
      for (let i = 1; i <= this.lastPage; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, this.currentPage - 1);
      let end = Math.min(this.lastPage - 1, this.currentPage + 1);

      if (this.currentPage <= 3) end = 4;
      else if (this.currentPage >= this.lastPage - 2) start = this.lastPage - 3;
      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < this.lastPage - 1) pages.push('...');
      pages.push(this.lastPage);
    }
    return pages;
  }

  candidateSearch(search: any): void {
    this.searchKeyword = search
    this.currentPage = 1 ;
    this.limit = 9;
    this.fetchcandidates(this.searchKeyword);
  }

  navigate(path: any, requestId?: any): void {
    const queryParams = requestId ? { requestId: requestId } : undefined;
    if (queryParams) this.router.navigate([path], { queryParams: queryParams });
    else this.router.navigate([path]);
  }


  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.fetchcandidates('');
  }

}
