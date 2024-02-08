import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environments';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  userList: any = [];
  selectedItem: any;
  loader: boolean = false;
  userCount: any;
  pageSize: number = 4;
  currentPage: number = 1;
  lastPage: any;
  constructor(private http: HttpClient, private router: Router) {

  }
  ngOnInit(): void {
    this.fetchUserList();
  }
  fetchUserList(): void {
    const totalPages = Math.ceil(this.userCount / this.pageSize);
    this.lastPage = totalPages;
    if (this.currentPage > totalPages) {

      this.currentPage = totalPages;
    }

    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEyLCJ1c2VyVHlwZSI6ImFkbWluIiwidXNlckVtYWlsIjoiYWRtaW5AbWFpbGluYXRvci5jb20ifQ.Uva57Y4MMA0yWz-BYcRD-5Zzth132GMGJkFVQA3Tn50'
    });

    this.http.get(`${environment.api_url}/user/lists?limit=${this.pageSize}&page=${this.currentPage}`, { headers }).subscribe((data: any) => {
      this.userList = data.users;
      this.userCount = data.userCount;
      console.log("response ", this.userList);
    })
  }

  navigateToDetail(id: any): void {
    this.router.navigate(['/detail'], {

    });
  }
  onSelect(item: any): void {
    this.selectedItem = item;

  }
  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.fetchUserList();
  }

}
