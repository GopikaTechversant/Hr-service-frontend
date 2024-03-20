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
  searchQuery: string = '';
  length: any = 20;
  pageSize = 9;
  pageIndex = 1;
  pageSizeOptions = [5, 10, 15, 20];
  showFirstLastButtons = true;
  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchcandidates('');
  }

  fetchcandidates(searchQuery: string): void {
    this.apiService.get(`/screening-station/v1/list-all?page=${this.pageIndex}&limit=${this.pageSize}&search=${searchQuery}`).subscribe((res: any) => {
      this.candidates_list = res.candidates;
    })
  }

  candidateSearch(): void {
    this.fetchcandidates(this.searchQuery);
  }

  navigate(path: any, requestId?: any): void {
    const queryParams = requestId ? { requestId: requestId } : undefined;
    if (queryParams) this.router.navigate([path], { queryParams: queryParams });
    else this.router.navigate([path]);
  }

  handlePageEvent(event: any) {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchcandidates('');
  }

  onPageChange(pageNumber: number): void {
    this.pageIndex = Math.max(1, pageNumber);
    this.fetchcandidates('');
  }

}
