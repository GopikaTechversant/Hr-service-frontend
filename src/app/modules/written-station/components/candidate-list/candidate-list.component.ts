import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ExportService } from 'src/app/services/export.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { StationSwitchComponent } from 'src/app/components/station-switch/station-switch.component';
import { WarningBoxComponent } from 'src/app/components/warning-box/warning-box.component';
import { StationCandidateDetailComponent } from 'src/app/components/station-candidate-detail/station-candidate-detail.component';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css']
})
export class CandidateListComponent implements OnInit {
  candidateList: any = [];
  loader: boolean = false;
  selectedItem: any;
  stationId: any;
  filterStatus: boolean = false;
  selectStatus: boolean = false;
  limit: number = 12;
  status: any;
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
  switchStations: Boolean = false;
  initialLoader: boolean = false;
  experience: string = '';
  today: Date = new Date();
  isExport: boolean = false;
  startDate: string | null = this.datePipe.transform(new Date(Date.now() - 150 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  endDate: string | null = this.datePipe.transform(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  candidateIds: any;

  constructor(private apiService: ApiService, private route: ActivatedRoute, private dialog: MatDialog, private datePipe: DatePipe,
    private router: Router, private toastr: ToastrService, private exportService: ExportService) { }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.filterStatus = false;
      this.requestList_open = false;
    }
  }

  ngOnInit(): void {
    this.initialLoader = true;
    this.filteredStatus = sessionStorage.getItem(`status_2`) ? sessionStorage.getItem(`status_2`) : '';
    const requirementData = sessionStorage.getItem(`requirement_2`);
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

  fetchStatus(): void {
    this.apiService.get(`/user/filter-status`).subscribe(res => {
      this.status = res?.data;
    });
  }

  fetchList(): void {
    if (!this.initialLoader) this.loader = true;
    this.candidateList = [];
    const url = `/written-station/list`;
    let params = [
      `search=${this.searchKeyword}`,
      `page=${this.isExport ? '' : this.currentPage}`,
      `limit=${this.isExport ? '' : this.limit}`,
      `position=${this.positionId ? this.positionId : ''}`,
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
              this.downloadAsExcel(jsonResponse.data, `written_candidate_list.xlsx`);
            };
            reader.readAsText(data);
          } else {
            this.downloadBlob(data, `written_candidate_list.xlsx`);
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
    this.apiService.get(`${url}?${params}`).subscribe(
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

  downloadAsExcel(jsonData: any[], fileName: string) {
    this.exportService.downloadAsExcel(jsonData, fileName);
  }

  downloadBlob(blob: Blob, fileName: string) {
    this.exportService.downloadBlob(blob, fileName);
  }

  downloadAsJson(jsonResponse: any) {
    this.exportService.downloadAsJson(jsonResponse);
  }

  onSearch(keyword: string): void {
    this.searchKeyword = keyword;
    this.fetchList();
  }

  onExperience(exp: any): void {
    this.experience = exp;
    this.fetchList();
  }

  selectPosition(position: { name: string, id: any }): void {
    this.displayPosition = position.name;
    this.positionId = position.id;
    sessionStorage.setItem(`requirement_2`, JSON.stringify({ name: this.displayPosition, id: this.positionId }));
    this.currentPage = 1;
    this.limit = 12;
    this.fetchList();
  }

  selectStatusFilter(item: string): void {
    this.filteredStatus = item;
    sessionStorage.setItem('status_2', this.filteredStatus);
    this.currentPage = 1;
    this.limit = 12;
    this.fetchList();
  }

  dateChange(data: { event: any, range: string }): void {
    let date = new Date(data.event.value);
    if (data.range == 'startDate') this.startDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    if (data.range == 'endDate') this.endDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.currentPage = 1;
    this.limit = 12;
    this.fetchList();
  }

  exportData(data: boolean): void {
    if (data) this.isExport = true;
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
          currentStation: 'Written',
          currentStationId: '2',
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

  fetchDetails(details: { id: any, status: any }): void {
    const id = details.id;
    const status = details.status;
    this.apiService.get(`/written-station/progressDetail?serviceId=${id}`).subscribe((data: any) => {
      if (data?.candidates) this.viewCandidateDetail(data?.candidates, status);
    });
  }

  viewCandidateDetail(item: any, status: any): void {
    const dialogRef = this.dialog.open(StationCandidateDetailComponent, {
      data: { candidateDetails: item, offerStatus: status },
    })
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      this.fetchList();
    })
  }

  clearFilter(item: any): void {
    if (item === 'status') {
      this.filteredStatus = '';
      sessionStorage.setItem('status_2', this.filteredStatus);
    }
    if (item === 'position') {
      this.displayPosition = '';
      this.positionId = '';
      sessionStorage.setItem(`requirement_2`, JSON.stringify({ name: this.displayPosition, id: this.positionId }));
    }
    if (item === 'search') this.searchKeyword = '';
    if (item === 'experience') this.experience = '';
    this.currentPage = 1;
    this.limit = 12;
    this.fetchList();
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.fetchList();
  }

 
}

