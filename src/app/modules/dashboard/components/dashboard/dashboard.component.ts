import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
})
export class DashboardComponent implements OnInit {
  candidates: any;
  lists: any[] = [];
  requestList: any;
  requestList_open: boolean = false;
  displayPosition: any;
  positionId: any;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.displayPosition = sessionStorage.getItem('position');
    this.positionId = sessionStorage.getItem('positionId');
    this.fetchcount();
    this.fetchRequirements();
  }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.requestList_open = false;
    }
  }

  fetchcount(): void {
    this.apiService.get(`/dashboard/card-data?requestId=${this.positionId}`).subscribe((res: any) => {
      if (res?.data) {
        this.lists = res?.data;
      }
    })
  }

  fetchRequirements(): void {
    this.apiService.get(`/service-request/list`).subscribe((res: any) => {
      if (res?.data) {
        this.requestList = res?.data;
      }
    })
  }

  selectPosition(name: string, id: string): void {
    this.displayPosition = name;
    this.positionId = id;
    sessionStorage.setItem('position', this.displayPosition);
    sessionStorage.setItem('positionId', this.positionId);
    this.fetchcount();
  }

}
