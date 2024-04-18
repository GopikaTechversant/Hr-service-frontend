import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-requisition-details',
  templateUrl: './requisition-details.component.html',
  styleUrls: ['./requisition-details.component.css']
})
export class RequisitionDetailsComponent implements OnInit {
  requestId: any;
  lists: any;
  requestName: any;
  currentPage: number = 1;
  pageSize: number = 10;
  candidateList: any;
  totalCount: any;
  lastPage: any;
  department: any;

  constructor(private apiService: ApiService, private datePipe: DatePipe, private tostr: ToastrService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.requestId = params['id'];
    });
    this.fetchcount();
    this.fetchCandidates('');
  }

  fetchcount(): void {
    this.apiService.get(`/dashboard/card-data?requestId=${this.requestId}`).subscribe((res: any) => {
      if (res?.data) {
        this.lists = res?.data;
        this.requestName = this.lists[0]?.position;
        this.department = this.lists[0]?.team;
      }
    })
  }

  fetchCandidates(searchKey: string): void {
    // this.apiService.get(`/candidate/list?search=${searchKey}&page=${this.currentPage}&limit=${this.pageSize}&serviceRequestId=${this.requestId}`).subscribe((data: any) => {
    // this.candidateList = data?.candidates;
    this.totalCount = 100;
    const totalPages = Math.ceil(this.totalCount / this.pageSize);
    this.lastPage = totalPages;
    if (this.currentPage > totalPages) this.currentPage = totalPages;
    // });
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
    this.fetchCandidates('');
  }



}
