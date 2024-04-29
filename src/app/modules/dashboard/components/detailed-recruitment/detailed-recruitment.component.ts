import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-detailed-recruitment',
  templateUrl: './detailed-recruitment.component.html',
  styleUrls: ['./detailed-recruitment.component.css'],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
})
export class DetailedRecruitmentComponent implements OnInit {
  chart: any;
  displayDate: any;
  length: any = 20;
  pageSize = 7;
  pageIndex = 1;
  showFirstLastButtons = true;
  candidateList: any[] = [];
  recruitersList: any[] = [];
  recruitersListOpen: boolean = false;
  selectedRecruitername: string = '';
  selectedRecruiterId: any;
  currentPage: number = 1;
  lastPage: any;
  userCount: any;
  totalCount: any;
  constructor(private apiService: ApiService) {
  }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.recruitersListOpen = false;
    }
  }

  ngOnInit(): void {
    this.selectedRecruiterId = '';
    this.fetchCandidateList();
    this.fetchRecruitersList();
  }

  fetchCandidateList(): void {
    this.apiService.get(`/dashboard/requirement-report?recuriter=${this.selectedRecruiterId}&page=${this.currentPage}&limit=${this.pageSize}`).subscribe((res: any) => {
      this.candidateList = res?.userRequirementReport;
      this.totalCount = res?.requirementCount;
      const totalPages = Math.ceil(this.totalCount / this.pageSize);
      this.lastPage = totalPages;
      if (this.currentPage > totalPages) this.currentPage = totalPages;
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

  clearFilter(): void {
    this.selectedRecruitername = "";
    this.selectedRecruiterId = "";
    this.currentPage = 1;
    this.pageSize = 7;
    this.fetchCandidateList()
  }

  fetchRecruitersList(): void {
    this.apiService.get(`/dashboard/recruiter-list`).subscribe((res: any) => {
      if (res?.data) {
        this.recruitersList = res?.data;
      }
    })
  }

  selectedRecruiter(id: number, name: string): void {
    this.selectedRecruitername = name;
    this.selectedRecruiterId = id;
    this.recruitersListOpen = false;
    this.currentPage = 1;
    this.pageSize = 7;
    this.fetchCandidateList()
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.fetchCandidateList();
  }

}
