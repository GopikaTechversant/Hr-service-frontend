import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HrCandidateDetailComponent } from '../hr-candidate-detail/hr-candidate-detail.component';
import { ApiService } from 'src/app/services/api.service';
import { StationSwitchComponent } from 'src/app/components/station-switch/station-switch.component';
import { WarningBoxComponent } from 'src/app/components/warning-box/warning-box.component';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environments';
import { ActivatedRoute, Router } from '@angular/router';

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
  initialLoader: boolean = false
  experience: string = '';
  isExport: boolean = false;
  today: Date = new Date();
  startDate: string | null = this.datePipe.transform(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  endDate: string | null = this.datePipe.transform(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  candidateIds: any;
  status: any;
  constructor(private dialog: MatDialog, private apiService: ApiService, private datePipe: DatePipe, private router: Router, private route: ActivatedRoute) { }
  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.filterStatus = false;
      this.requestList_open = false;
    }
  }

  ngOnInit(): void {
    this.initialLoader = true;
    this.filteredStatus = sessionStorage.getItem('status_5') ? sessionStorage.getItem('status_5') : '';
    const requirementData = sessionStorage.getItem(`requirement_5`);
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
    this.fetchStatus();
  }

  fetchRequirements(): void {
    this.apiService.get(`/service-request/list`).subscribe((res: any) => {
      if (res?.data) {
        this.requestList = res?.data;
      }
    })
  }

  fetchStatus(): void {
    this.apiService.get(`/user/filter-status`).subscribe(res => {
      this.status = res?.data;
    });
  }

  fetchList(): void {
    if (!this.initialLoader) this.loader = true;
    const url = `/hr-station/list`
    let params = [
      `search=${this.searchKeyword}`,
      `page=${this.isExport ? '' : this.currentPage}`,
      `limit=${this.isExport ? '' : this.limit}`,
      `position=${this.positionId}`,
      `experience=${this.experience.trim()}`,
      `fromDate=${this.startDate}`,
      `toDate=${this.endDate}`,
      `status_filter=${this.filteredStatus}`,
      `report=${this.isExport}`
    ].filter(param => param.split('=')[1] !== '').join('&');  

    if (this.isExport) {
      if (this.candidateIds) {
        const idsParams = this.candidateIds.map((id: string) => `ids=${id}`).join('&');
        params += `&${idsParams}`;
      }
      const exportUrl = `${environment.api_url}${url}?${params}`;
      window.open(exportUrl, '_blank');
      this.isExport = false;
      if (this.isExport === false) this.fetchList();
      return;
    }

    this.apiService.get(`${url}?${params}`).subscribe((data: any) => {
      this.loader = false;
      this.initialLoader = false;
      this.candidateList = [];
      if (data?.candidates) {
        this.candidateList.push(data?.candidates);
        this.totalCount = data?.totalCount;
        const totalPages = Math.ceil(this.totalCount / this.limit);
        this.lastPage = totalPages;
        if (this.currentPage > totalPages) this.currentPage = totalPages;
      }
    });
  }

  getSelectedCandidateIds(): void {
    const selectedCandidates = this.candidateList.flat().filter((candidate: { isSelected: any; }) => candidate.isSelected);
    this.candidateIds = selectedCandidates.map((candidate: { serviceId: any; }) => candidate?.serviceId);
    // this.selectedItem = this.candidateIds;
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

  dateChange(event: any, range: string): void {
    let date = new Date(event?.value);
    if (range == 'startDate') this.startDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    if (range == 'endDate') this.endDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.currentPage = 1;
    this.limit = 10;
    this.fetchList();
  }

  experienceValidation(event: any): void {
    const intermediateAllowedCharacters = /^-?(\d{0,1}\d?)?(\.\d{0,2})?$/;
    let enteredValue = event?.target?.value + event.key;
    if (event.key === "Backspace" || event.key === "Delete" || event.key.includes("Arrow")) return;
    if (!intermediateAllowedCharacters.test(enteredValue)) event.preventDefault();
  }

  exportData(): void {
    this.isExport = true;
    this.fetchList();
  }

  searchCandidate(searchTerm: string): void {
    this.searchKeyword = searchTerm;
    this.currentPage = 1;
    this.limit = 10;
    this.fetchList();
  }

  searchByExperience(experience: string): void {
    this.experience = experience;
    this.currentPage = 1;
    this.limit = 10;
    this.fetchList();
  }

  selectPosition(name: string, id: string): void {
    this.requestList_open = false;
    this.displayPosition = name;
    this.positionId = id;
    sessionStorage.setItem(`requirement_5`, JSON.stringify({ name: this.displayPosition, id: this.positionId }));
    this.currentPage = 1;
    this.limit = 10;
    this.fetchList();
  }

  selectStatusFilter(item: string): void {
    this.filteredStatus = item;
    sessionStorage.setItem('status_5', this.filteredStatus);
    this.currentPage = 1;
    this.limit = 10;
    this.fetchList();
  }

  clearFilter(item: any): void {
    if (item === 'status') {
      this.filteredStatus = '';
      sessionStorage.setItem('status_5', this.filteredStatus);
    }
    if (item === 'position') {
      this.displayPosition = '';
      this.positionId = '';
      sessionStorage.setItem(`requirement_5`, JSON.stringify({ name: this.displayPosition, id: this.positionId }));
    }
    if (item === 'search') this.searchKeyword = '';
    if (item === 'experience') this.experience = '';
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
    })
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      this.fetchList();
    })
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.fetchList();
  }

  onSwitchStation(candidate: any): void {
    if (candidate?.serviceStatus === 'pending' && candidate?.progressStatus === '0') {
      const userId = localStorage.getItem('userId');
      const dialogRef = this.dialog.open(StationSwitchComponent, {
        data: {
          userId: userId,
          name: candidate['candidate.candidateFirstName'] + ' ' + candidate['candidate.candidateLastName'],
          serviceId: candidate?.serviceId,
          currentStation: 'Hr Manager',
          currentStationId: '5',
          requirement: candidate['serviceRequest.requestName']
        },
      })
      dialogRef.afterClosed().subscribe(() => {
        this.fetchList();
      });
    } else {
      const dialogRef = this.dialog.open(WarningBoxComponent, {})
      dialogRef.afterClosed().subscribe(() => {
        this.fetchList();
      });
    }
  }

  selectCandidate(id: any): void {
    this.router.navigateByUrl(`/dashboard/candidate-details/${id}`);
  }

}
