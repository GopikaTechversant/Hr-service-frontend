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
  pageSize = 5;
  pageIndex = 1;
  showFirstLastButtons = true;
  candidateList: any[] = [];
  recruitersList: any[] = [];
  recruitersListOpen: boolean = false;
  selectedRecruitername: string = 'Choose Recruiter';
  selectedRecruiterId: any;
  currentPage: number = 1;
  lastPage: any;
  userCount: any;
  constructor(private apiService: ApiService) {
  }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.recruitersListOpen = false;
    }
  }

  ngOnInit(): void {
    this.fetchCandidateList('');
    this.fetchRecruitersList();
  }

  fetchCandidateList(recruiter: string): void {
    const totalPages = Math.ceil(this.userCount / this.pageSize);
    this.lastPage = totalPages;
    if (this.currentPage > totalPages) this.currentPage = totalPages;
    this.apiService.get(`/dashboard/requirement-report?recuriter=${recruiter}&page=${this.currentPage}&limit=${this.pageSize}`).subscribe((res: any) => {
      this.candidateList = res?.userRequirementReport;
    })
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
    this.fetchCandidateList(this.selectedRecruiterId)
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.fetchCandidateList('');
  }

}
