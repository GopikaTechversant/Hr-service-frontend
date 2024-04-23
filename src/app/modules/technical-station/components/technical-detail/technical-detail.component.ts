import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CandidateDetailModalComponent } from '../candidate-detail-modal/candidate-detail-modal.component';
import { ApiService } from 'src/app/services/api.service';
import { StationSwitchComponent } from 'src/app/components/station-switch/station-switch.component';

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
  filteredStatus: any = '';
  candidateStatus: string = 'Choose Candidate Status';
  currentPage: number = 1;
  totalCount: any;
  lastPage: any;
  searchKeyword: string = '';
  requestList: any;
  requestList_open: any;
  displayPosition: string = '';
  positionId: any;
  stationsList: any;
  switchStations: Boolean = false;;
 
  constructor(private apiService: ApiService, private route: ActivatedRoute, private dialog: MatDialog) { }
  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.filterStatus = false;
      this.requestList_open = false;
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.stationId = params['id'];
      this.filteredStatus = sessionStorage.getItem(`status_${this.stationId}`) ? sessionStorage.getItem(`status_${this.stationId}`) : '';      
      const requirementData = sessionStorage.getItem(`requirement_${this.stationId}`);
      if (requirementData) {
        let requirement = JSON.parse(requirementData);
        if (requirement) {
          this.displayPosition = requirement.name;
          this.positionId = requirement.id;
        }
      } else {
        this.displayPosition = '';
        this.positionId = '';
      }
      this.searchKeyword = '';
      this.currentPage = 1;
      this.limit = 10;
      this.candidateList = [];
      this.fetchList();
    });
    this.fetchRequirements();
  }

  fetchRequirements(): void {
    this.apiService.get(`/service-request/list`).subscribe((res: any) => {
      if (res?.data) {
        this.requestList = res?.data;
      }
    })
  }

  fetchStations(): void {
    this.apiService.get(`/user/stations`).subscribe((res: any) => {
      this.stationsList = res?.data;
    });
  }

  fetchList(): void {
    this.loader = true;
    this.candidateList = [];
    if (this.stationId === '3') {
      this.apiService.get(`/technical-station/list?search=${this.searchKeyword}&page=${this.currentPage}&limit=${this.limit}&position=${this.positionId}&status_filter=${this.filteredStatus}`).subscribe((data: any) => {
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
      this.apiService.get(`/technical-station-two/list?search=${this.searchKeyword}&page=${this.currentPage}&limit=${this.limit}&position=${this.positionId}&status_filter=${this.filteredStatus}`).subscribe((data: any) => {
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
    this.fetchList();
  }

  selectPosition(name: string, id: string): void {
    this.requestList_open = false;
    this.displayPosition = name;
    this.positionId = id;
    sessionStorage.setItem(`requirement_${this.stationId}`, JSON.stringify({ name: this.displayPosition, id: this.positionId }));
    this.fetchList();
  }

  selectStatusFilter(item: string): void {
    this.filteredStatus = item;
    sessionStorage.setItem(`status_${this.stationId}`, this.filteredStatus);
    this.currentPage = 1;
    this.limit = 10;
    this.fetchList();
  }

  clearFilter(item: any): void {
    if (item === 'status') {
      this.filteredStatus = '';
      sessionStorage.setItem(`status_${this.stationId}`, this.filteredStatus);
    }
    if (item === 'position') {
      this.displayPosition = '';
      this.positionId = '';
      sessionStorage.setItem(`requirement_${this.stationId}`, JSON.stringify({ name: this.displayPosition, id: this.positionId }));
    }
    if (item === 'search') this.searchKeyword = '';
    this.currentPage = 1;
    this.limit = 10;
    this.fetchList();
  }

  viewCandidateDetail(item: any, status: any): void {
    const dialogRef = this.dialog.open(CandidateDetailModalComponent, {
      data: { candidateId: item['candidate.candidateId'], stationId: this.stationId, candidateDetails: item, progressStatus: status },
    })
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      this.candidateList = [];
      this.fetchList();
    })
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.fetchList();
  }

  onSwitchStation(candidate: any): void {
    const userId = localStorage.getItem('userId');
    const dialogRef = this.dialog.open(StationSwitchComponent, {
      data: {userId: userId , name : candidate['candidate.candidateFirstName'] + ' '+  candidate['candidate.candidateLastName'], 
       serviceId : candidate?.serviceId,currentStation : candidate?.currentStation,
      currentStationId:this.stationId  },
      width: '700px',
      height: '500px'
    })

    dialogRef.afterClosed().subscribe(() => {
      this.fetchList();
    });
  }

}
