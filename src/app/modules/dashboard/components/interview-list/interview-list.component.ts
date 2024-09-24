import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-interview-list',
  templateUrl: './interview-list.component.html',
  styleUrls: ['./interview-list.component.css']
})
export class InterviewListComponent implements OnInit {

  loader: any;
  initialLoader: any;
  userId: any;
  limit : number = 12;
  page:number = 1;
  candidateList: any;
  constructor(private apiService: ApiService) { }

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

}
