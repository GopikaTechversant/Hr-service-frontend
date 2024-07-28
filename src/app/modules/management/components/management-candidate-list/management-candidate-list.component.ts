import { Component, OnInit } from '@angular/core';
import { ManagementDetailComponent } from '../management-detail/management-detail.component';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { StationSwitchComponent } from 'src/app/components/station-switch/station-switch.component';
import { WarningBoxComponent } from 'src/app/components/warning-box/warning-box.component';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-management-candidate-list',
  templateUrl: './management-candidate-list.component.html',
  styleUrls: ['./management-candidate-list.component.css']
})
export class ManagementCandidateListComponent implements OnInit {
  candidateList: any[] = [];
  searchKeyword: string = '';
  currentPage: number = 1;
  limit: number = 10
  filteredStatus: any = '';
  displayPosition: string = '';
  positionId: any;
  requestList_open: any;
  requestList: any;
  initialLoader: boolean = false
  loader: boolean = true;
  totalCount: any;
  lastPage: any;
  filterStatus: boolean = false;
  Status: any = [
    { status: 'pending' },
    { status: 'rejected' },
    { status: 'done' },
    { status: 'moved' }
  ]
  constructor(private apiService: ApiService, private dialog: MatDialog,private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.fetchCandidates();
    this.fetchRequirements();
  }

  fetchCandidates(): void {
    if (!this.initialLoader) this.loader = true;
    this.apiService.get(`/management-station/list?search=${this.searchKeyword}&page=${this.currentPage}&limit=${this.limit}&status_filter=${this.filteredStatus}&report=false`).subscribe((data: any) => {
      this.candidateList = [];
      this.initialLoader = false;
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

  fetchDetails(id: any, status: any): void {
    this.apiService.get(`/management-station/candidateDetail?serviceId=${id}`).subscribe((data: any) => {
      if (data?.candidates) this.viewCandidateDetail(data?.candidates, status);
    });
  }

  fetchRequirements(): void {
    this.apiService.get(`/service-request/list`).subscribe((res: any) => {
      if (res?.data) {
        this.requestList = res?.data;
      }
    })
  }

  viewCandidateDetail(item: any, status: any): void {
    const dialogRef = this.dialog.open(ManagementDetailComponent, {
      data: { candidateDetails: item, offerStatus: status },
    })
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      this.fetchCandidates();
    })
  }

  searchCandidate(searchTerm: string): void {
    this.searchKeyword = searchTerm;
    this.currentPage = 1;
    this.limit = 10;
    this.fetchCandidates();
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
    this.fetchCandidates();
  }

  selectPosition(name: string, id: string): void {
    this.requestList_open = false;
    this.displayPosition = name;
    this.positionId = id;
    sessionStorage.setItem(`requirement`, JSON.stringify({ name: this.displayPosition, id: this.positionId }));
    this.fetchCandidates();
  }

  onSwitchStation(candidate: any): void {
    if (candidate?.serviceStatus === 'pending' && candidate?.progressStatus === '0') {
      const userId = localStorage.getItem('userId');
      const dialogRef = this.dialog.open(StationSwitchComponent, {
        data: {
          userId: userId,
          name: candidate['candidate.candidateFirstName'] + ' ' + candidate['candidate.candidateLastName'],
          serviceId: candidate?.serviceId,
          currentStation: 'Management',
          currentStationId: '6',
          requirement: candidate['serviceRequest.requestName']
        },
      })
      dialogRef.afterClosed().subscribe(() => {
        this.fetchCandidates();
      });
    } else {
      const dialogRef = this.dialog.open(WarningBoxComponent, {})
      dialogRef.afterClosed().subscribe(() => {
        this.fetchCandidates();
      });
    }
  }

  selectStatusFilter(item: string): void {
    this.filteredStatus = item;
    sessionStorage.setItem('status', this.filteredStatus);
    this.currentPage = 1;
    this.limit = 10;
    this.fetchCandidates();
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.fetchCandidates();
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

  selectCandidate(id: any): void {
    this.router.navigateByUrl(`/dashboard/candidate-details/${id}`);
  }
}
