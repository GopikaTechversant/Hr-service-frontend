import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
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
  pageSize = 10;
  candidateList: any[] = [];
  recruitersList: any[] = [];
  recruitersListOpen: boolean = false;
  selectedRecruitername: string = '';
  selectedRecruiterId: any;
  currentPage: number = 1;
  lastPage: any;
  userCount: any;
  totalCount: any;
  report: boolean = false;
  url:any;
  candidateIds: any;
  initialLoader: boolean = false
  loader: boolean = true;

  constructor(private apiService: ApiService, private router: Router) {
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

  // fetchCandidateList(): void {
  //   this.url = `/dashboard/requirement-report?recuriter=${this.selectedRecruiterId}&page=${this.currentPage}&limit=${this.pageSize}&report=${this.report}`;
  //   this.apiService.get(this.url).subscribe((res: any) => {
  //     this.candidateList = res?.userRequirementReport;
  //     this.totalCount = res?.requirementCount;
  //     const totalPages = Math.ceil(this.totalCount / this.pageSize);
  //     this.lastPage = totalPages;
  //     if (this.currentPage > totalPages) this.currentPage = totalPages;
  //   })
  // }

  fetchCandidateList(): void {
    if (!this.initialLoader) this.loader = true;
    const url = `/dashboard/requirement-report`
    let params = [
      `recuriter=${this.selectedRecruiterId}`,
      `page=${this.currentPage}`,
      `limit=${this.pageSize}`,
      `report=${this.report}`
    ].join('&');

    if (this.report) {
      if (this.candidateIds) {
        const idsParams = this.candidateIds.map((id: string) => `ids=${id}`).join('&');
        params += `&${idsParams}`;
      }
      const exportUrl = `${environment.api_url}${url}?${params}`;
      console.log("exportUrl",exportUrl);
      window.open(exportUrl, '_blank');
      this.report = false;
      if (this.report === false) this.fetchCandidateList();
      return;
  }
  this.apiService.get(`${url}?${params}`).subscribe((res: any) => {
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

  exportData(): void {
    this.report = true;
    this.fetchCandidateList();
  }

  getSelectedCandidateIds(): void {
    const selectedCandidates = this.candidateList.flat().filter((candidate: { isSelected: any; }) => candidate.isSelected);
    this.candidateIds = selectedCandidates.map((candidate: { serviceId: any; }) => candidate?.serviceId);
    console.log('Selected Candidate IDs:', this.candidateIds);
    // this.selectedItem = this.candidateIds;
  }
  selectCandidate(id: any): void {
    this.router.navigateByUrl(`/dashboard/candidate-details/${id}`);
  }
}
