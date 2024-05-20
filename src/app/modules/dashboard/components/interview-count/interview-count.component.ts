import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';

import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-interview-count',
  templateUrl: './interview-count.component.html',
  styleUrls: ['./interview-count.component.css'],
  providers: [DatePipe],
  // host: {
  //   '(document:click)': 'onBodyClick($event)'
  // }
})
export class InterviewCountComponent implements OnInit {
  startDate: string | null = this.datePipe.transform(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  endDate: string | null = this.datePipe.transform(new Date(), 'yyyy-MM-dd');  
  pageSize = 10;
  countArray: any[] = [];
  currentPage: number = 1;
  lastPage: any;
  userCount: any;
  totalCount: any;
  today: Date = new Date();

  constructor(private datePipe: DatePipe, private apiService: ApiService) { }
  ngOnInit(): void {
    this.fetchInterviewCounts();
  }

  fetchInterviewCounts(): void {
    this.apiService.get(`/dashboard/interview-count?fromDate=${this.startDate}&toDate=${this.endDate}&page=${this.currentPage}&limit=${this.pageSize}`).subscribe((count: any) => {
      if(count?.data){
        this.countArray = count?.data;
        this.totalCount = count?.totalCount;
        const totalPages = Math.ceil(this.totalCount / this.pageSize);
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

  dateChange(event: any, range: string): void {
    let date = new Date(event?.value);
    if (range == 'startDate') this.startDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    if (range == 'endDate') this.endDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.currentPage = 1;
    this.pageSize = 10;
    this.fetchInterviewCounts();
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.pageSize = 10;
    this.fetchInterviewCounts();
  }

}
