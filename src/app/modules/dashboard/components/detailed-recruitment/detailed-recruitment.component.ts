import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
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
  @Input() startDate: any;
  @Input() endDate: any;
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
  url: any;
  candidateIds: any;
  initialLoader: boolean = false
  loader: boolean = true;
  data: any;
  selectedDataBy: string = 'position';

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
    // this.fetchRecruitersList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['startDate'] && !changes['startDate'].isFirstChange()) {
      this.startDate = changes['startDate'].currentValue;
      this.fetchCandidateList();
    } else if (changes['endDate'] && !changes['endDate'].isFirstChange()) {
      this.endDate = changes['endDate'].currentValue
      this.fetchCandidateList();
    }
  }
  // http://localhost:3001/dashboard/recruiter-requirement-report?dataBy=user&start_date=2024-06-01&end_date=2024-06-10&limit=1&page=1
  fetchCandidateList(): void {
    console.log("selectedOption: string = 'requirement';", this.selectedDataBy);
    if (!this.initialLoader) this.loader = true;
    const url = `/dashboard/recruiter-requirement-report`
    let params = [
      `dataBy=${this.selectedDataBy}`,
      `page=${this.report ? '' : this.currentPage}`,
      `limit=${this.report ? '' : this.pageSize}`,
      `report=${this.report}`,
      `start_date=${this.startDate}`,
      `end_date=${this.endDate}`
    ].filter(param => param.split('=')[1] !== '').join('&');  // Filter out empty parameters
    if (this.report) {
      if (this.candidateIds) {
        const idsParams = this.candidateIds.map((id: string) => `ids=${id}`).join('&');
        params += `&${idsParams}`;
      }
      const exportUrl = `${environment.api_url}${url}?${params}`;
      window.open(exportUrl, '_blank');
      this.report = false;
      if (this.report === false) this.fetchCandidateList();
      return;
    }
    this.apiService.get(`${url}?${params}`).subscribe((res: any) => {
      this.candidateList = res;
      console.log(" this.candidateList", res);
      this.totalCount = res?.requirementCount;
      const totalPages = Math.ceil(this.totalCount / this.pageSize);
      this.lastPage = totalPages;
      if (this.currentPage > totalPages) this.currentPage = totalPages;
    })
  }

  onRadioChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedDataBy = target.value;
    this.fetchCandidateList();
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

  // fetchRecruitersList(): void {
  //   this.apiService.get(`/dashboard/recruiter-list`).subscribe((res: any) => {
  //     if (res?.data) {
  //       this.recruitersList = res?.data;
  //     }
  //   })
  // }

  // selectedRecruiter(id: number, name: string): void {
  //   this.selectedRecruitername = name;
  //   this.selectedRecruiterId = id;
  //   this.recruitersListOpen = false;
  //   this.currentPage = 1;
  //   this.pageSize = 7;
  //   this.fetchCandidateList()
  // }

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
  }

  selectCandidate(id: any): void {
    this.router.navigateByUrl(`/dashboard/candidate-details/${id}`);
  }
}
