import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HrCandidateDetailComponent } from '../hr-candidate-detail/hr-candidate-detail.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-hr-candidate-list',
  templateUrl: './hr-candidate-list.component.html',
  styleUrls: ['./hr-candidate-list.component.css'],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
})
export class HrCandidateListComponent implements OnInit {
  @Output() itemSelected = new EventEmitter<any>();
  candidateList: any = [];
  loader: boolean = true;
  selectedItem: any = [];
  Status: any = [
    { status: 'pending' },
    { status: 'rejected' },
    { status: 'done' }
  ]
  filteredStatus: any = '';
  filterStatus: boolean = false;
  currentPage: number = 1;
  limit: number = 10
  totalCount: any;
  lastPage: any;
  searchKeyword: string = '';
  requestList_open: any;
  displayPosition: string = '';
  positionId: any;
  requestList: any;
  constructor(private dialog: MatDialog, private apiService: ApiService) { }
  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.filterStatus = false;
      this.requestList_open = false;
    }
  }

  ngOnInit(): void {
    this.loader = true;
    this.filteredStatus = sessionStorage.getItem('status') ? sessionStorage.getItem('status') : '';
    const requirementData = sessionStorage.getItem(`requirement`);
    if (requirementData) {
      let requirement = JSON.parse(requirementData);
      if (requirement) {
        this.displayPosition = requirement?.name;
        this.positionId = requirement?.id;
      }
    } else {
      this.displayPosition = '';
      this.positionId = '';
    }
    this.fetchList();
    this.fetchRequirements();
  }

  fetchRequirements(): void {
    this.apiService.get(`/service-request/list`).subscribe((res: any) => {
      if (res?.data) {
        this.requestList = res?.data;
      }
    })
  }

  fetchList(): void {
    this.apiService.get(`/hr-station/list?search=${this.searchKeyword}&page=${this.currentPage}&limit=${this.limit}&status_filter=${this.filteredStatus}&position=${this.positionId}`).subscribe((data: any) => {
      this.candidateList = [];
      this.loader = false;
      if (data.candidates) {
        this.candidateList.push(data.candidates);
        this.totalCount = data?.totalCount
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

  searchCandidate(searchTerm: string): void {
    this.searchKeyword = searchTerm;
    this.currentPage = 1;
    this.limit = 10;
    this.fetchList();
  }

  selectPosition(name: string, id: string): void {
    this.requestList_open = false;
    this.displayPosition = name;
    this.positionId = id;
    sessionStorage.setItem(`requirement`, JSON.stringify({ name: this.displayPosition, id: this.positionId }));
    this.fetchList();
  }

  selectStatusFilter(item: string): void {
    this.filteredStatus = item;
    sessionStorage.setItem('status', this.filteredStatus);
    this.currentPage = 1;
    this.limit = 10;
    this.fetchList();
  }

  clearFilter(item: any): void {
    if (item === 'status') {
      this.filteredStatus = '';
      sessionStorage.setItem('status', this.filteredStatus);
    }
    if (item === 'position') {
      this.displayPosition = '';
      this.positionId = '';
      sessionStorage.setItem(`requirement`, JSON.stringify({ name: this.displayPosition, id: this.positionId }));
    }
    if (item === 'search') this.searchKeyword = '';
    this.currentPage = 1;
    this.limit = 10;
    this.fetchList();
  }

  fetchDetails(id: any, status: any): void {
    this.apiService.get(`/hr-station/candidateDetail?serviceId=${id}`).subscribe((data: any) => {
      if (data?.candidates) this.viewCandidateDetail(data?.candidates, status);
    });
  }

  viewCandidateDetail(item: any, status: any): void {
    const dialogRef = this.dialog.open(HrCandidateDetailComponent, {
      data: { candidateDetails: item, offerStatus: status },
      width: '600px',
      height: '300px'
    })
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      this.fetchList();
    })
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.fetchList();
  }


}
