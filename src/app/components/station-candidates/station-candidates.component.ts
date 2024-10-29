import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ExportService } from 'src/app/services/export.service';

@Component({
  selector: 'app-station-candidates',
  templateUrl: './station-candidates.component.html',
  styleUrls: ['./station-candidates.component.css'],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
})
export class StationCandidatesComponent implements OnInit {
  @Output() switchStation = new EventEmitter<any>();
  @Output() viewDetails: EventEmitter<{ id: any, status: any }> = new EventEmitter<{ id: any, status: any }>();
  @Input () modalClose : boolean = false;
  startDate: string | null = this.datePipe.transform(new Date(Date.now() - 150 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  endDate: string | null = this.datePipe.transform(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  filteredStatus: any = '';
  searchKeyword: string = '';
  initialLoader: boolean = false;
  loader: boolean = false;
  experience: string = '';
  status: any[] = [];
  candidateList: any;
  isExport: boolean = false;
  requestList: any;
  requestList_open: any;
  filterStatus: any;
  stationsList: any;
  stationId: any;
  url: any;
  displayPosition: string = '';
  positionId: any;
  currentStation: string = '';
  today: Date = new Date();
  candidateIds: any;
  limit: number = 12;
  currentPage: number = 1;
  totalCount: any;
  toastr: any;
  baseUrl: any;
  lastPage: any;
  constructor(private apiService: ApiService, private datePipe: DatePipe, private route: ActivatedRoute, private router: Router, private exportService: ExportService) { }

  ngOnInit(): void {
    this.initialLoader = true;
    this.currentStation = this.router.url.split('/')[1];
    this.route.params.subscribe(params => {
      this.stationId = params['id'];
      this.initialLoader = true;
      this.url = `/technical/${this.stationId}`;
      if (this.currentStation === 'written') this.stationId = '2';
      if (this.currentStation === 'management') this.stationId = '6'
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
      this.candidateList = [];
      this.limit = 12;
      this.currentPage = 1
      this.fetchList();
      this.fetchRequirements();
      this.fetchStatus();
    });
  }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.filterStatus = false;
      this.requestList_open = false;
    }
  }

  fetchStations(): void {
    this.apiService.get(`/user/stations`).subscribe((res: any) => {
      this.stationsList = res?.data;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.modalClose) this.fetchList();
    // if (changes['modalClose'] && !changes['modalClose'].isFirstChange()) this.fetchList();
  }

  fetchList(): void {
    if (!this.initialLoader) this.loader = true;
    this.candidateList = [];
    if (this.currentStation === 'technical') {
      this.baseUrl = this.stationId === '3' ? `/technical-station/list` : `/technical-station-two/list`;
    }
    if (this.currentStation === 'written') {
      this.baseUrl = '/written-station/list'
    }
    if (this.currentStation === 'management') {
      this.baseUrl = '/management-station/list'
    }
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
      const exportUrl = `${this.baseUrl}?${params}`;
      this.apiService.getTemplate(exportUrl).subscribe(
        (data: Blob) => {
          if (data.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (event) => {
              const text = event.target?.result as string;
              const jsonResponse = JSON.parse(text);
              this.downloadAsExcel(jsonResponse.data, `${this.currentStation}_${this.currentStation === 'technical' ? (this.stationId === '3' ? '1' : '2') : ''}_candidate_list.xlsx`);
            };
            reader.readAsText(data);
          } else {
            this.downloadBlob(data, `${this.currentStation}${this.currentStation === 'technical' ? (this.stationId === '3' ? '1' : '2') : ''}_candidate_list.xlsx`);
          }
        },
        (error: any) => {
          this.loader = false;
          this.initialLoader = false;
        }
      );
      this.isExport = false;
      if (this.isExport === false) this.fetchList();
      return;
    }
    this.apiService.get(`${this.baseUrl}?${params}`).subscribe(
      (data: any) => {
        this.loader = false;
        this.initialLoader = false;
        this.candidateList = [];
        this.candidateIds = [];
        if (data?.candidates) {
          this.candidateList.push(data?.candidates);
          this.totalCount = data?.totalCount;
          const totalPages = Math.ceil(this.totalCount / this.limit);
          this.lastPage = totalPages;
          if (this.currentPage > totalPages) this.currentPage = totalPages;
        }
      },
      (error: any) => {
        this.loader = false;
        this.initialLoader = false;
        if (error.status === 500) {
          this.toastr.error('Internal server error');
        } else {
          this.toastr.error('Something went wrong');
        }
      }
    );
  }

  handleModalClose(status: boolean): void {
    this.fetchList(); 
  }

  fetchStatus(): void {
    this.apiService.get(`/user/filter-status`).subscribe(res => {
      this.status = res?.data;
    });
  }

  fetchRequirements(): void {
    this.apiService.get(`/service-request/list`).subscribe((res: any) => {
      if (res?.data) this.requestList = res?.data;
    })
  }

  onSearch(keyword: string): void {
    this.searchKeyword = keyword;
    this.currentPage = 1;
    this.limit = 12;
    this.fetchList();
  }

  searchByExperience(exp: any): void {
    this.experience = exp;
    this.currentPage = 1;
    this.limit = 12;
    this.fetchList();
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

  selectPosition(name: string, id: string): void {
    this.displayPosition = name;
    this.requestList_open = false;
    this.positionId = id;
    sessionStorage.setItem(`requirement_${this.stationId}`, JSON.stringify({ name: this.displayPosition, id: this.positionId }));
    this.currentPage = 1;
    this.limit = 12;
    this.fetchList();
  }

  selectStatusFilter(item: string): void {
    this.filteredStatus = item;
    this.filterStatus = false;
    sessionStorage.setItem(`status_${this.stationId}`, this.filteredStatus);
    this.currentPage = 1;
    this.limit = 12;
    this.fetchList();
  }

  dateChange(event: any, range: string): void {
    let date = new Date(event.value);
    if (range == 'startDate') this.startDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    if (range == 'endDate') this.endDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.currentPage = 1;
    this.limit = 12;
    this.fetchList();
  }

  exportData(): void {
    this.isExport = true;
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
    if (item === 'experience') this.experience = '';
    this.currentPage = 1;
    this.limit = 12;
    this.fetchList();
  }

  experienceValidation(event: any): void {
    const intermediateAllowedCharacters = /^-?(\d{0,1}\d?)?(\.\d{0,2})?$/;
    let enteredValue = event?.target?.value + event.key;
    if (event.key === "Backspace" || event.key === "Delete" || event.key.includes("Arrow")) return;
    if (!intermediateAllowedCharacters.test(enteredValue)) event.preventDefault();
  }

  onSwitchStation(item: any): void {
    this.switchStation.emit(item);
  }

  fetchDetails(id: any, status: any): void {
    this.viewDetails.emit({ id, status });
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.fetchList();
  }

  selectCandidate(id: any): void {
    this.router.navigateByUrl(`/dashboard/candidate-details/${id}`);
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
}
