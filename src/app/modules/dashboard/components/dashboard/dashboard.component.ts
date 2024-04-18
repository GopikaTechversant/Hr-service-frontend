import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  displayPosition: string = '';
  positionId: any;

  constructor(private apiService: ApiService, public router: Router, private tostr: ToastrService) { }

  ngOnInit(): void {
    const position = sessionStorage.getItem(`requirement`);
    if (position) {
      let requirement = JSON.parse(position);
      if (requirement) {
        this.displayPosition = requirement?.name;
        this.positionId = requirement?.id;
      }
    } else {
      this.displayPosition = '';
      this.positionId = '';
    }
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

  navigateToDetail(position: any): void {
    const foundRequest = this.requestList.find((item: { requestName: any; }) => item.requestName === position);
    if (foundRequest) {
      const id = foundRequest?.requestId;
      this.router.navigateByUrl(`/dashboard/requisition-detail/${id}`);
    } else this.tostr.warning('No matching position found for navigation');
  }


  selectPosition(name: string, id: string): void {
    this.requestList_open = false;
    this.displayPosition = name;
    this.positionId = id;
    sessionStorage.setItem(`position`, JSON.stringify({ name: this.displayPosition, id: this.positionId }));
    this.fetchcount();
  }

  clearFilter(): void {
    this.displayPosition = '';
    this.positionId = '';
    sessionStorage.setItem(`position`, JSON.stringify({ name: this.displayPosition, id: this.positionId }));
  }

}
