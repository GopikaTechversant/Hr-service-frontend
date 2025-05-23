import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HrCandidateDetailComponent } from '../hr-candidate-detail/hr-candidate-detail.component';
import { ApiService } from 'src/app/services/api.service';
import { StationSwitchComponent } from 'src/app/components/station-switch/station-switch.component';
import { WarningBoxComponent } from 'src/app/components/warning-box/warning-box.component';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExportService } from 'src/app/services/export.service';

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
  limit: number = 12
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
  // startDate: string | null = this.datePipe.transform(new Date(Date.now() - 150 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  startDate: string | null = this.datePipe.transform(new Date(new Date().getFullYear(), new Date().getMonth() - 5, new Date().getDate()), 'yyyy-MM-dd');
  endDate: string | null = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  // endDate: string | null = this.datePipe.transform(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  candidateIds: any;
  status: any;
  userType: any;
  serviceStatus: any;
  requisitionSearchValue: string = '';
  requsitionSuggestions: any[] = [];
  searchvalue: string = "";
  constructor(private dialog: MatDialog, private apiService: ApiService, private datePipe: DatePipe, private router: Router,
    private toastr: ToastrService, private exportService: ExportService) { }
  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.filterStatus = false;
      this.requestList_open = false;
    }
  }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.initialLoader = true;
    this.filteredStatus = sessionStorage.getItem('status_5') ? sessionStorage.getItem('status_5') : '';
    const requirementData = sessionStorage.getItem(`requirement_5`);
    // Retrieve the last page from localStorage (if available)
    const savedPage = localStorage.getItem('currentPageHr');
    this.currentPage = savedPage ? parseInt(savedPage, 10) : 1;
    if (requirementData) {
      let requirement = JSON.parse(requirementData);
      if (requirement) {
        this.displayPosition = requirement?.name;
        this.positionId = requirement?.id;
        this.requisitionSearchValue = requirement.name;
      }
    } else {
      this.displayPosition = '';
      this.positionId = '';
      this.requisitionSearchValue = '';
    }
    // this.limit = 12;
    // this.currentPage = 1

    this.fetchList(this.currentPage);
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

  fetchList(page: any): void {
    if (page) this.currentPage = page;
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
      const exportUrl = `${url}?${params}`;
      this.apiService.getTemplate(exportUrl).subscribe(
        (data: Blob) => {
          if (data.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (event) => {
              const text = event.target?.result as string;
              const jsonResponse = JSON.parse(text);
              this.downloadAsExcel(jsonResponse.data, 'hr_candidate_list.xlsx');
            };
            reader.readAsText(data);
          } else {
            this.downloadBlob(data, 'hr_candidate_list.xlsx');
          }
        },
        (error: any) => {
          this.loader = false;
          this.initialLoader = false;
        }
      ); this.isExport = false;
      if (this.isExport === false) this.fetchList(this.currentPage);
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
    localStorage.setItem('currentPageHr', this.currentPage.toString());
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
  getSelectedCandidateIds(): void {
    const selectedCandidates = this.candidateList.flat().filter((candidate: { isSelected: any; }) => candidate.isSelected);
    this.candidateIds = selectedCandidates.map((candidate: { serviceId: any; }) => candidate?.serviceId);
  }

  dateChange(event: any, range: string): void {
    let date = new Date(event?.value);
    if (range == 'startDate') this.startDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    if (range == 'endDate') this.endDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.currentPage = 1;
    this.limit = 12;
    this.fetchList(this.currentPage);
  }

  experienceValidation(event: any): void {
    const intermediateAllowedCharacters = /^-?(\d{0,1}\d?)?(\.\d{0,2})?$/;
    let enteredValue = event?.target?.value + event.key;
    if (event.key === "Backspace" || event.key === "Delete" || event.key.includes("Arrow")) return;
    if (!intermediateAllowedCharacters.test(enteredValue)) event.preventDefault();
  }

  exportData(): void {
    this.isExport = true;
    this.fetchList(this.currentPage);
  }

  searchCandidate(searchTerm: string): void {
    this.searchKeyword = searchTerm;
    if (this.searchKeyword.trim() === '') {
      this.currentPage = 1;
      this.limit = 12;
      this.fetchList(this.currentPage);
      return;
    }
    this.currentPage = 1;
    this.limit = 12;
    this.fetchList(this.currentPage);
  }

  searchByExperience(experience: string): void {
    this.experience = experience;
    this.currentPage = 1;
    this.limit = 12;
    this.fetchList(this.currentPage);
  }

  selectPosition(name: string, id: string): void {
    this.requestList_open = false;
    this.displayPosition = name;
    this.requisitionSearchValue = name;
    this.positionId = id;
    sessionStorage.setItem(`requirement_5`, JSON.stringify({ name: this.displayPosition, id: this.positionId }));
    this.currentPage = 1;
    this.limit = 12;
    this.fetchList(this.currentPage);
  }

  selectStatusFilter(item: string): void {
    this.filteredStatus = item;
    sessionStorage.setItem('status_5', this.filteredStatus);
    this.currentPage = 1;
    this.limit = 12;
    this.fetchList(this.currentPage);
  }

  clearFilter(item: any): void {
    if (item === 'status') {
      this.filteredStatus = '';
      sessionStorage.setItem('status_5', this.filteredStatus);
    }
    if (item === 'position') {
      this.displayPosition = '';
      this.positionId = '';
      this.requisitionSearchValue = '';
      sessionStorage.setItem(`requirement_5`, JSON.stringify({ name: this.displayPosition, id: this.positionId }));
    }
    if (item === 'search') this.searchKeyword = '';
    if (item === 'experience') this.experience = '';
    this.currentPage = 1;
    this.limit = 12;
    this.fetchList(this.currentPage);
  }

  fetchDetails(id: any, offerStatus: any, reviewStatus: any): void {
    this.apiService.get(`/hr-station/candidateDetail?serviceId=${id}`).subscribe((data: any) => {
      console.log("data?.candidates", data?.candidates?.serviceRequest);
      this.serviceStatus = data?.candidates?.serviceRequest?.requestServiceId;
      if (data?.candidates) this.viewCandidateDetail(data?.candidates, offerStatus, reviewStatus);
    });
  }

  viewCandidateDetail(item: any, offerStatus: any, reviewStatus: any): void {
    const dialogRef = this.dialog.open(HrCandidateDetailComponent, {
      data: { candidateDetails: item, offerStatus: offerStatus, reviewStatus: reviewStatus, serviceRequestId: this.serviceStatus },
    })
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      this.fetchList(this.currentPage);
    })
  }

  onSwitchStation(candidate: any): void {
    if (candidate?.serviceStatus === 'pending') {
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
        this.fetchList(this.currentPage);
      });
    } else {
      const dialogRef = this.dialog.open(WarningBoxComponent, {})
      dialogRef.afterClosed().subscribe(() => {
        this.fetchList(this.currentPage);
      });
    }
  }

  selectCandidate(id: any): void {
    this.router.navigateByUrl(`/dashboard/candidate-details/${id}`);
  }

  getRequsitionSuggestion(event: any) {
    this.requestList_open = true;
    this.requisitionSearchValue = event?.target.value;
    this.apiService.get(`/service-request/list?search=${this.requisitionSearchValue}`).subscribe((res: any) => {
      if (res?.data) this.requsitionSuggestions = res?.data.filter((suggestion: any) =>
        suggestion.requestName.toLowerCase().startsWith(this.searchvalue.toLowerCase())
      );
    });
  }

}
