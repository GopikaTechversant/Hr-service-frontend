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
  pageSize = 4;
  pageIndex = 1;
  constructor(private http: HttpClient, private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchRequirementDetails();
  }
  fetchRequirementDetails(): void {
    const totalPages = Math.ceil(this.userCount / this.pageSize);
    this.lastPage = totalPages;
    if (this.currentPage > totalPages) this.currentPage = totalPages;
    this.apiService.get(`/written-station/v1/list-all`).subscribe((res: any) => {
      this.candidates_list = res?.candidates;
    })
  }
  navigate(path: any, requestId?: any): void {
    const queryParams = requestId ? { requestId: requestId } : undefined;
    if (queryParams) this.router.navigate([path], { queryParams: queryParams });
    else this.router.navigate([path]);
  }
  candidateSearch() {

  }
  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.fetchRequirementDetails();
  }
}
