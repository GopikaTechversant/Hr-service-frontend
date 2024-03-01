import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  candidates: any;
  lists: any[] = [];
  requestList: any;
  requestList_open: boolean = false;
  displayPosition: string = 'Select Position';
  positionId: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchcount();
    this.fetchRequirements();
  }

  fetchcount(): void {
    this.http.get(`${environment.api_url}/dashboard/card-data?requestId=${this.positionId}`).subscribe((res: any) => {
      if(res?.data){
        this.lists = res?.data;
      }
    })
  }

  fetchRequirements(): void {
    this.http.get(`${environment.api_url}/service-request/list`).subscribe((res: any) => {
      if (res?.data) {
        this.requestList = res?.data;
      }
    })
  }

  selectPosition(name: string, id: string): void {
    this.displayPosition = name;
    this.positionId = id;
    this.fetchcount();
  }

}
