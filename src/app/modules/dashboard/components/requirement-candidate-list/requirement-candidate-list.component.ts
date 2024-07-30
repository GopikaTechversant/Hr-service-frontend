import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteComponent } from 'src/app/components/delete/delete.component';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { EditRequirementComponent } from '../edit-requirement/edit-requirement.component';
@Component({
  selector: 'app-requirement-candidate-list',
  templateUrl: './requirement-candidate-list.component.html',
  styleUrls: ['./requirement-candidate-list.component.css'],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
})
export class RequirementCandidateListComponent implements OnInit {
  candidates_list: any = [];
  searchKeyword: string = '';
  length: any = 20;
  limit = 12;
  currentPage = 1;
  showFirstLastButtons = true;
  totalCount: any;
  lastPage: any;
  initialLoader: boolean = false;
  loader: boolean = false;
  deleteRequirementId: any;
  editRequirement: any;
  filterStatus: boolean = false;
  filteredStatus: any = '';
  status: any[] = ['Opening Requisitions','Closed Requisitions'];
  constructor(private router: Router, private apiService: ApiService, private dialog: MatDialog, private toastr: ToastrService) { }
  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.filterStatus = false;
    }
  }
  ngOnInit(): void {
    this.initialLoader = true;
    this.filteredStatus = sessionStorage.getItem('requisition') ? sessionStorage.getItem('requisition') : '';
    this.fetchcandidates('');
    console.log("status",this.status);
    
  }

  fetchcandidates(searchQuery: string): void {
    if (!this.initialLoader) this.loader = true
    this.apiService.get(`/screening-station/v1/list-all?page=${this.currentPage}&limit=${this.limit}&search=${searchQuery.trim()}`).subscribe((res: any) => {
      if (res) {
        this.initialLoader = false;
        this.loader = false
        this.candidates_list = res?.candidates;
        this.totalCount = res?.totalCount;
        const totalPages = Math.ceil(this.totalCount / this.limit);
        this.lastPage = totalPages;
        if (this.currentPage > totalPages) this.currentPage = totalPages;
      }
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

  requirementSearch(search: any): void {
    this.searchKeyword = search;
    this.currentPage = 1;
    this.limit = 9;
    this.fetchcandidates(this.searchKeyword);
  }

  navigate(path: any, requestId?: any): void {
    const queryParams = requestId ? { requestId: requestId } : undefined;
    if (queryParams) this.router.navigate([path], { queryParams: queryParams });
    else this.router.navigate([path]);
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.fetchcandidates('');
  }

  onStatusChange(candidate: any): void {
    this.router.navigate(['dashboard/add-candidate'], {
      state: { candidate }
    });
  }

  update(requirement: any): void {
    this.editRequirement = requirement;
    const dialogRef = this.dialog.open(EditRequirementComponent, {
      data: this.editRequirement,
      width: '50%',
      height: '80%'
    })
    dialogRef.componentInstance.onEditSuccess.subscribe(() => {
      this.limit = 9;
      this.fetchcandidates('');
    })
  }

  delete(id: any): void {
    this.deleteRequirementId = id;
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: this.deleteRequirementId,
      width: '500px',
      height: '250px'
    })
    dialogRef.componentInstance.onDeleteSuccess.subscribe(() => {
      this.apiService.post(`/service-request/delete`, { requestId: this.deleteRequirementId }).subscribe({
        next: (res: any) => {
          this.generatePageNumbers();
          this.fetchcandidates('');
        },
        error: (error) => {
          this.toastr.error(error?.error?.message ? error?.error?.message : 'Unable to Delete candidates');
        }
      })
    })
  }

  selectStatusFilter(item: string): void {
    this.filteredStatus = item;
    sessionStorage.setItem('requisition', this.filteredStatus);
    this.currentPage = 1;
    this.limit = 10;
    this.fetchcandidates('');
  }

  clearFilter(item: any): void {
    if (item === 'search') this.searchKeyword = '';
    if (item === 'status') {
      this.filteredStatus = '';
      sessionStorage.setItem('requisition', this.filteredStatus);
    }
    this.currentPage = 1;
    this.limit = 14;
    this.fetchcandidates('');
  }

}
