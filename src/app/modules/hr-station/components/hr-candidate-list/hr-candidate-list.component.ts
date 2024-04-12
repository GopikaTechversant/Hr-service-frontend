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
  filteredStatus: any = ' ';
  filterStatus: boolean = false;
  currentPage: number = 1;
  limit: number = 10
  totalCount: any;
  lastPage: any;
  searchKeyword: any;
  constructor(private dialog: MatDialog, private apiService: ApiService) { }
  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.filterStatus = false;
    }
  }

  ngOnInit(): void {
    this.loader = true;
    this.filteredStatus = sessionStorage.getItem('status') ? sessionStorage.getItem('status') : ' ';
    this.fetchList('');
  }

  fetchList(search : any) : void {
    this.searchKeyword = search;
    this.apiService.get(`/hr-station/list?search=${this.searchKeyword}&page=${this.currentPage}&limit=${this.limit}&status_filter=${this.filteredStatus}`).subscribe((data: any) => {
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

  searchCandidate(searchTerm: string):void{
    this.searchKeyword = searchTerm;
    this.fetchList(this.searchKeyword);    
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.fetchList('');    
  }


  selectStatusFilter(item: string): void {
    this.filteredStatus = item;
    sessionStorage.setItem('status', this.filteredStatus);
    this.fetchList('');
  }

  clearFilter(): void {
    this.filteredStatus = ' ';
    this.selectStatusFilter(this.filteredStatus);
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
      this.fetchList('');
    })
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.fetchList('');
  }


}
