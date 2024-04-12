import { Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from 'src/app/components/delete/delete.component';
import { EditComponent } from 'src/app/components/edit/edit.component';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css']
})
export class CandidateListComponent {
  @Input() positionId: any
  length: any = 20;
  pageSize = 10;
  pageIndex = 1;
  pageSizeOptions = [10, 25, 30];
  showFirstLastButtons = true;
  candidateList: any;
  searchKeyword: string = '';
  currentPag: number = 1;
  currentLimit: number = 7;
  totalCount: any;
  data: any;
  candidateId: any;
  deleteCandidateId: any;
  currentPage: number = 1;
  lastPage: any;
  userCount: any;
  requestId: any;
  constructor(private apiService: ApiService, private router: Router, private dialog: MatDialog,private toastr : ToastrService) { }

  ngOnInit(): void {
    this.requestId = this.positionId ? this.positionId : ' ';
    this.fetchCandidates('');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.positionId) {
      this.requestId = this.positionId;
      this.fetchCandidates('');
    }
  }

  fetchCandidates(searchKey: string): void {
    this.searchKeyword = searchKey;
    this.apiService.get(`/candidate/list?search=${this.searchKeyword}&page=${this.currentPage}&limit=${this.pageSize}&serviceRequestId=${this.requestId}`).subscribe((data: any) => {
      this.data = data;
      this.candidateList = [];
      this.candidateList = data?.candidates;
      this.totalCount = data?.candidateCount;
      const totalPages = Math.ceil(this.totalCount / this.pageSize);
      this.lastPage = totalPages;
      if (this.currentPage > totalPages) this.currentPage = totalPages;
    });
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

  searchCandidate(search: string): void {
    this.searchKeyword = search;
    this.fetchCandidates(this.searchKeyword);
  }

  clearFilter(): void {
    this.searchKeyword = '';
    this.fetchCandidates(this.searchKeyword);
  }


  navigate(path: any, queryParam: any): void {
    if (queryParam) this.router.navigate([path], { queryParams: { type: queryParam } });
    else this.router.navigate([path]);
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, false);
  }

  pageChange(event: any): void {
    let skip = parseInt(event, 10);
    this.currentPag = skip;
  }

  delete(id: any): void {
    this.deleteCandidateId = id;
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: id,
      width: '500px',
      height: '250px'
    })
    dialogRef.componentInstance.onDeleteSuccess.subscribe(() => {
      this.apiService.post(`/candidate/remove-candidate`, { candidateId: this.deleteCandidateId }).subscribe({
        next: (res: any) => {
          this.fetchCandidates('');
        },
        error: (error) => {
          this.toastr.error(error?.error?.message ? error?.error?.message : 'Unable to Delete candidates');
        }
      })
    })
  }

  edit(id: any): void {
    const dialogRef = this.dialog.open(EditComponent, {
      data: id,
      width: '950px',
      height: '980px'
    })
    dialogRef.componentInstance.onEditSuccess.subscribe(() => {
      this.fetchCandidates('');
    })
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.fetchCandidates('');
  }

}
