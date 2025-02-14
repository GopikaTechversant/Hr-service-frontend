import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-interview-list',
  templateUrl: './interview-list.component.html',
  styleUrls: ['./interview-list.component.css']
})
export class InterviewListComponent implements OnInit {
  startDate: string | null = this.datePipe.transform(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  endDate: string | null = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  loader: any;
  initialLoader: any;
  userId: any;
  limit : number = 12;
  candidateList: any;
  today: Date = new Date();
  currentPage: number = 1;
  lastPage: any;
  totalCount: any;
  constructor(private apiService: ApiService,private router: Router,private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.initialLoader = true;
    this.fetchUserList(this.currentPage);
  }

  fetchUserList(page:any): void {
    if(page) this.currentPage = page;
    this.apiService.get(`/screening-station/todays-interview-list?search=&page=${this.currentPage}&limit=${this.limit}&position=&experience=&status_filter=pending&ids=&fromDateData=${this.startDate}&toDateData=${this.endDate}`).subscribe((res: any) => {
      if (res?.candidates) {
        this.candidateList = res?.candidates        
        this.loader = false;
        this.initialLoader = false;
        this.totalCount = res?.candidateCount;
        const totalPages = Math.ceil(this.totalCount / this.limit);
        this.lastPage = totalPages;
        if (this.currentPage > totalPages) this.currentPage = totalPages;
      }
    },
      (error: any) => {
        this.loader = false;
        this.initialLoader = false;
      }
    );
  }

  selectCandidate(id: any): void {
    this.router.navigateByUrl(`/dashboard/candidate-details/${id}`);
  }

  dateChange(event: any, range: string): void {
    let date = new Date(event.value);
    if (range == 'startDate') this.startDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    if (range == 'endDate') this.endDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.fetchUserList(this.currentPage);
  }

}
