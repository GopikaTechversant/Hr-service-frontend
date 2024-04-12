import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CandidateDetailModalComponent } from '../candidate-detail-modal/candidate-detail-modal.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-technical-detail',
  templateUrl: './technical-detail.component.html',
  styleUrls: ['./technical-detail.component.css'],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
})
export class TechnicalDetailComponent implements OnInit {
  @Output() itemSelected = new EventEmitter<any>();
  candidateList: any = [];
  loader: boolean = false;
  selectedItem: any;
  stationId: any;
  filterStatus: boolean = false;
  selectStatus: boolean = false;
  limit: number = 10;
  Status: any = [
    { status: 'pending' },
    { status: 'rejected' },
    { status: 'done' }
  ]
  filteredStatus: any = ' ';
  candidateStatus: string = 'Choose Candidate Status';
  currentPage: number = 1;
  totalCount: any;
  lastPage: any;
  searchKeyword: any;

  constructor(private apiService: ApiService, private route: ActivatedRoute, private dialog: MatDialog) {
    // this.route.params.subscribe(params => {
    //   this.stationId = params['id'];
    // });
  }
  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.filterStatus = false;
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.stationId = params['id'];
      this.filteredStatus = sessionStorage.getItem(`status_${this.stationId}`) ? sessionStorage.getItem(`status_${this.stationId}`) : ' ';
      this.currentPage = 1 ;
      this.limit = 10;
      this.candidateList = [];
      this.fetchList('');
    });
  }

  fetchList(search:any): void {
    this.loader = true;
    this.candidateList = [];
    this.searchKeyword = search
    if (this.stationId === '3') {
      this.searchKeyword = search;
      this.apiService.get(`/technical-station/list?search=${this.searchKeyword}&page=${this.currentPage}&limit=${this.limit}&status_filter=${this.filteredStatus}`).subscribe((data: any) => {
        this.loader = false;
        if (data?.candidates) {
          this.candidateList.push(data?.candidates);
          this.totalCount = data?.totalCount
          const totalPages = Math.ceil(this.totalCount / this.limit);
          this.lastPage = totalPages;
          if (this.currentPage > totalPages) this.currentPage = totalPages;
        }
      });
    } else if (this.stationId === '4') {
      this.searchKeyword = search;
      this.apiService.get(`/technical-station-two/list?search=${this.searchKeyword}&page=${this.currentPage}&limit=10&status_filter=${this.filteredStatus}`).subscribe((data: any) => {
        this.loader = false;
        if (data?.candidates) {
          this.candidateList.push(data?.candidates);
          this.totalCount = data?.totalCount
          const totalPages = Math.ceil(this.totalCount / this.limit);
          this.lastPage = totalPages;
          if (this.currentPage > totalPages) this.currentPage = totalPages;
        }
      });
    }
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


  fetchDetails(id: any, status: any): void {
    if (this.stationId === '3') {
      this.apiService.get(`/technical-station/progressDetail?serviceId=${id}`).subscribe((data: any) => {
        if (data?.candidates) this.viewCandidateDetail(data?.candidates, status);
      });
    } else if (this.stationId === '4') {
      this.apiService.get(`/technical-station-two/progressDetail?serviceId=${id}`).subscribe((data: any) => {
        if (data?.candidates) this.viewCandidateDetail(data?.candidates, status);
      });
    }
  }

  selectStatusFilter(item: string): void {
    this.filteredStatus = item;
    sessionStorage.setItem(`status_${this.stationId}`, this.filteredStatus);
    this.fetchList('');
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.fetchList('');    
  }


  clearFilter(): void {
    this.filteredStatus = ' ';
    this.selectStatusFilter(this.filteredStatus);
  }

  statusClick(candidate: any, status: string, event: Event): void {
    candidate.selectedStatus = status;
    candidate.selectStatus = false;
    event.stopPropagation();
  }

  toggleDropdown(candidate: any, event: Event): void {
    candidate.selectStatus = !candidate?.selectStatus;
    event.stopPropagation();
  }

  viewCandidateDetail(item: any, status: any): void {
    const dialogRef = this.dialog.open(CandidateDetailModalComponent, {
      data: { candidateId: item['candidate.candidateId'], stationId: this.stationId, candidateDetails: item, progressStatus: status },
      width: '600px',
      height: '300px'
    })
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      this.candidateList = [];
      this.fetchList('');
    })
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.fetchList('');
  }

}
