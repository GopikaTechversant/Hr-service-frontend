import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-requisition-details',
  templateUrl: './requisition-details.component.html',
  styleUrls: ['./requisition-details.component.css'],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
})
export class RequisitionDetailsComponent implements OnInit {
  requestId: any;
  lists: any;
  requestName: any;
  currentPage: number = 1;
  pageSize: number = 9;
  candidateList: any;
  totalCount: any;
  lastPage: any;
  department: any;
  filterStatus: Boolean = false;
  filteredStatus: string = "Total Applicants";
  initialLoader: Boolean = false;
  today: Date = new Date();
  startDate: string | null = this.datePipe.transform(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  endDate: string | null = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  constructor(private apiService: ApiService, private datePipe: DatePipe, private tostr: ToastrService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initialLoader = true
    this.route.params.subscribe(params => {
      this.requestId = params['id'];
    });
    this.filteredStatus = sessionStorage.getItem('requirement_status') ?? 'Total Applicants';
    this.currentPage = 1;
    this.pageSize = 9;
    this.fetchcount();
    this.fetchCandidates();
  }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.filterStatus = false;
    }
  }

  dateChange(event: any, range: string): void {
    let date = new Date(event?.value);
    if (range == 'startDate') this.startDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    if (range == 'endDate') this.endDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.fetchcount();
  }


  fetchcount(): void {
    this.apiService.get(`/dashboard/card-data?requestId=${this.requestId}&fromDate=${this.startDate}&todate=${this.endDate}`).subscribe((res: any) => {
      if (res?.data) {
        this.initialLoader = false;
        this.lists = res?.data;
        this.requestName = this.lists[0]?.position;
        this.department = this.lists[0]?.team;
      }
    })
  }

  fetchCandidates(): void {
    this.apiService.get(`/dashboard/candidate-by-status?positionId=${this.requestId}&page=${this.currentPage}&limit=${this.pageSize}&status=${this.filteredStatus.split(' ')[0].toLowerCase()}`).subscribe((data: any) => {
      this.candidateList = data?.candidates;
      this.initialLoader = false;
      this.totalCount = data?.totalCount;
      const totalPages = Math.ceil(this.totalCount / this.pageSize);
      this.lastPage = totalPages;
      if (this.currentPage > totalPages) this.currentPage = totalPages;
    });
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

  selectStatusFilter(item: any): void {
    this.filteredStatus = item;
    sessionStorage.setItem('requirement_status', this.filteredStatus);
    this.currentPage = 1;
    this.pageSize = 9
    this.fetchCandidates();
  }

  clearFilter(): void {
    this.filteredStatus = "Total Applicants";
    sessionStorage.setItem('requirement_status', this.filteredStatus);
    this.currentPage = 1;
    this.pageSize = 9
    this.fetchCandidates();
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.fetchCandidates();
  }

  selectCandidate(id: any): void {
    this.router.navigateByUrl(`/dashboard/candidate-details/${id}`);
  }

}
