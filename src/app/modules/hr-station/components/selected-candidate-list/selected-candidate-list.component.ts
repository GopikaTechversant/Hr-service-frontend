import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ExportService } from 'src/app/services/export.service';

@Component({
  selector: 'app-selected-candidate-list',
  templateUrl: './selected-candidate-list.component.html',
  styleUrls: ['./selected-candidate-list.component.css']
})
export class SelectedCandidateListComponent {
  @Output() itemSelected = new EventEmitter<any>();
  candidateList: any = [];
  loader: boolean = true;
  selectedItem: any = [];
  Status: any = [
    { status: 'pending' },
    { status: 'rejected' },
    { status: 'done' },
    { status: 'moved' }
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
  initialLoader: boolean = false
  experience: string = '';
  isExport: boolean = false;
  today: Date = new Date();
  startDate: string | null = this.datePipe.transform(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  endDate: string | null = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  candidateIds: any;
  userType:any;
  constructor(private dialog: MatDialog, private apiService: ApiService, private datePipe: DatePipe, private router: Router, private exportService: ExportService) { }
  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.filterStatus = false;
      this.requestList_open = false;
    }
  }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType')
    this.initialLoader = true;
    this.filteredStatus = sessionStorage.getItem('status') ? sessionStorage.getItem('status') : '';
    const requirementData = sessionStorage.getItem(`requirement_select`);
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
    if (!this.initialLoader) this.loader = true;
    const url = `/hr-station/list`
    let params = [
      `search=${this.searchKeyword}`,
      `page=${this.isExport ? '' : this.currentPage}`,
      `limit=${this.isExport ? '' : this.limit}`,
      `position=${this.positionId}`,
      `experience=${this.experience.trim()}`,
      `fromDate=`,
      `toDate=`,
      `status_filter=done`,
      `report=${this.isExport}`
    ].filter(param => param.split('=')[1] !== '').join('&');

    if (this.isExport) {
      if (this.candidateIds) {
        const idsParams = this.candidateIds.map((id: string) => `ids=${id}`).join('&');
        params += `&${idsParams}`;
      }
      const exportUrl = `${url}?${params}`;
      this.apiService.getTemplate(exportUrl).subscribe(
        (data: Blob) => {
          if (data.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (event) => {
              const text = event.target?.result as string;
              const jsonResponse = JSON.parse(text);
              this.downloadAsExcel(jsonResponse.data, 'hired_candidate_list.xlsx');
            };
            reader.readAsText(data);
          } else {
            this.downloadBlob(data, 'hired_candidate_list.xlsx');
          }
        },
        (error: any) => {
          this.loader = false;
          this.initialLoader = false;
        }
      ); this.isExport = false;
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

  downloadAsExcel(jsonData: any[], fileName: string) {
    this.exportService.downloadAsExcel(jsonData, fileName);
  }

  downloadBlob(blob: Blob, fileName: string) {
    this.exportService.downloadBlob(blob, fileName);
  }

  downloadAsJson(jsonResponse: any) {
    this.exportService.downloadAsJson(jsonResponse);
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
    sessionStorage.setItem(`requirement_select`, JSON.stringify({ name: this.displayPosition, id: this.positionId }));
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
      sessionStorage.setItem(`requirement_select`, JSON.stringify({ name: this.displayPosition, id: this.positionId }));
    }
    if (item === 'search') this.searchKeyword = '';
    if (item === 'experience') this.experience = '';
    this.currentPage = 1;
    this.limit = 10;
    this.fetchList();
  }

  selectCandidate(id: any): void {
    this.router.navigateByUrl(`/dashboard/candidate-details/${id}`);
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.fetchList();
  }

}
