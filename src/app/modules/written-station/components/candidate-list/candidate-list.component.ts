import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css']
})
export class CandidateListComponent implements OnInit {
  candidates_list: any = [];
  searchQuery: string = '';
  currentPage: number = 1;
  lastPage: any;
  userCount: any;
  pageSize = 12;
  pageIndex = 1;
  totalCount: any;
  limit = 9;
  searchKeyword: string = '';
  initialLoader: boolean = false;
  loader: boolean = false;
  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
    this.initialLoader = true;
    this.fetchRequirementDetails('');
  }

  fetchRequirementDetails(searchQuery: string): void {
    if (!this.initialLoader) this.loader = true;
    this.apiService.get(`/written-station/v1/list-all?page=${this.currentPage}&limit=${this.pageSize}&search=${searchQuery.trim()}`).subscribe((res: any) => {
      if (res) {
        this.initialLoader = false;
        this.loader = false;
        this.candidates_list = res?.candidates;
        this.totalCount = res?.totalCount;
        const totalPages = Math.ceil(this.totalCount / this.limit);
        this.lastPage = totalPages;
        if (this.currentPage > totalPages) this.currentPage = totalPages;
      }
    })
  }

  navigate(path: any, requestId?: any): void {
    const queryParams = requestId ? { requestId: requestId } : undefined;
    if (queryParams) this.router.navigate([path], { queryParams: queryParams });
    else this.router.navigate([path]);
  }

  requirementSearch(search: any): void {
    this.searchKeyword = search
    this.currentPage = 1;
    this.limit = 9;
    this.fetchRequirementDetails(this.searchKeyword);
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

  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.fetchRequirementDetails('');
  }

  clearFilter(): void {
    this.searchKeyword = '';
    this.currentPage = 1;
    this.limit = 14;
    this.fetchRequirementDetails('');
  }

  onStatusChange(candidate: any): void {
    this.router.navigate(['dashboard/add-candidate'], {
      state: { candidate }
    });
  }
}
