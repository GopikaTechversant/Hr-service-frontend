import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environments';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from 'src/app/components/delete/delete.component';
import { EditComponent } from '../edit/edit.component';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  userList: any = [];
  selectedItem: any;
  loader: boolean = false;
  pageSize: number = 10;
  currentPage: number = 1;
  lastPage: any;
  userCount: any;
  candidateId: any;
  totalCount: any;
  limit = 9;
  initialLoader : boolean = false;
  // headers = new HttpHeaders({
  //   'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEyLCJ1c2VyVHlwZSI6ImFkbWluIiwidXNlckVtYWlsIjoiYWRtaW5AbWFpbGluYXRvci5jb20ifQ.Uva57Y4MMA0yWz-BYcRD-5Zzth132GMGJkFVQA3Tn50'
  // });
  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog,private apiService:ApiService) {

  }

  ngOnInit(): void {
    this.initialLoader = true;
    this.fetchUserList();
  }

  fetchUserList(): void {
    // const headers = new HttpHeaders({
    //   'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEyLCJ1c2VyVHlwZSI6ImFkbWluIiwidXNlckVtYWlsIjoiYWRtaW5AbWFpbGluYXRvci5jb20ifQ.Uva57Y4MMA0yWz-BYcRD-5Zzth132GMGJkFVQA3Tn50'
    // });
    this.apiService.get(`/user/lists?limit=${this.pageSize}&page=${this.currentPage}`).subscribe((data: any) => {
      this.userList = data.users;
      this.userCount = data.userCount;
      if (data) {
        this.initialLoader = false;
        this.userList = data?.users;
        this.totalCount = data?.userCount;
        const totalPages = Math.ceil(this.totalCount / this.limit);
        this.lastPage = totalPages;
        if (this.currentPage > totalPages) this.currentPage = totalPages;
      }
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
  delete(id: any): void {
    this.candidateId = id;
    // const headers = new HttpHeaders({
    //   'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEyLCJ1c2VyVHlwZSI6ImFkbWluIiwidXNlckVtYWlsIjoiYWRtaW5AbWFpbGluYXRvci5jb20ifQ.Uva57Y4MMA0yWz-BYcRD-5Zzth132GMGJkFVQA3Tn50'
    // });
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: id,
      width: '500px',
      height: '250px'
    })
    dialogRef.componentInstance.onDeleteSuccess.subscribe(() => {
      this.http.post(`${environment.api_url}/user/delete`, { userId: this.candidateId }).subscribe((res: any) => {
        this.fetchUserList();
      })
    })
  }
  update(id: any): void {
    this.candidateId = id;
    const dialogRef = this.dialog.open(EditComponent, {
      data: id,
      width: '950px',
      height: '500px'
    })
    dialogRef.componentInstance.onEditSuccess.subscribe(() => {
      this.fetchUserList();
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
}
