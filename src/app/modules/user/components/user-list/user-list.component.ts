import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from 'src/app/components/delete/delete.component';
import { EditComponent } from '../edit/edit.component';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
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
  initialLoader: boolean = false;
  userType: any;
  // headers = new HttpHeaders({
  //   'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEyLCJ1c2VyVHlwZSI6ImFkbWluIiwidXNlckVtYWlsIjoiYWRtaW5AbWFpbGluYXRvci5jb20ifQ.Uva57Y4MMA0yWz-BYcRD-5Zzth132GMGJkFVQA3Tn50'
  // });
  constructor(private toastr: ToastrService, private router: Router, private dialog: MatDialog, private apiService: ApiService) {

  }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.initialLoader = true;
    this.fetchUserList(this.currentPage);
  }

  fetchUserList(page: any): void {
    if (page) this.currentPage = page;
    const limit = this.pageSize;
    this.apiService.get(`/user/lists?limit=${limit}&page=${this.currentPage}`).subscribe((data: any) => {
      if (data) {
        this.initialLoader = false;
        this.userList = data.users;
        this.totalCount = data.userCount;
        const totalPages = Math.ceil(this.totalCount / limit);
        this.lastPage = totalPages;
        if (this.currentPage > totalPages) {
          this.currentPage = totalPages;
          this.fetchUserList(this.currentPage);
        }
      }
    });
  }

  navigateToDetail(id: any): void {
    this.router.navigate(['/detail'], {
    });
  }

  onSelect(item: any): void {
    this.selectedItem = item;
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
      this.apiService.post(`/user/delete`, { userId: this.candidateId }).subscribe((res: any) => {
        this.fetchUserList(this.currentPage);
        this.toastr.success('User Deleted succesfully')

      })
    })
  }
  update(id: any): void {
    this.candidateId = id;
    const dialogRef = this.dialog.open(EditComponent, {
      data: id,
      width: '700px',
      height: '450px'
    })
    dialogRef.componentInstance.onEditSuccess.subscribe(() => {
      this.fetchUserList(this.currentPage);
    })
  }
}
