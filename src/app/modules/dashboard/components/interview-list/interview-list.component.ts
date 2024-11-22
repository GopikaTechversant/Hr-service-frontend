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
  page:number = 1;
  candidateList: any;
  today: Date = new Date();
  constructor(private apiService: ApiService,private router: Router,private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.initialLoader = true;
    this.fetchUserList();
  }

  fetchUserList(): void {
    this.apiService.get(`/screening-station/todays-interview-list?search=&page=1&limit=10&position=&experience=&status_filter=pending&ids=`).subscribe((res: any) => {
      if (res?.candidates) {
        this.candidateList = res?.candidates        
        this.loader = false;
        this.initialLoader = false;
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

}
