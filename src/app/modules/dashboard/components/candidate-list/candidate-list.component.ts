import { Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from 'src/app/components/delete/delete.component';
import { EditComponent } from 'src/app/components/edit/edit.component';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { AssignRequirementComponent } from '../assign-requirement/assign-requirement.component';
import { ExportService } from 'src/app/services/export.service';
@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css']
})
export class CandidateListComponent {
  @Input() positionId: any
  pageSize = 13;
  pageIndex = 1;
  showFirstLastButtons = true;
  candidateList: any;
  searchKeyword: string = '';
  totalCount: any;
  data: any;
  candidateId: any;
  deleteCandidateId: any;
  currentPage: number = 1;
  lastPage: any;
  userCount: any;
  requestId: any;
  initialLoader: boolean = false;
  report: boolean = false;
  url: any;
  candidateIds: any;
  candidates: any;
  candidateIdsRequirement: any;
  userId: any;
  loader: boolean = true;
  resumeSourceIds: any;

  constructor(private apiService: ApiService, private router: Router, private dialog: MatDialog, private toastr: ToastrService, private exportService: ExportService) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.initialLoader = true;
    this.requestId = this.positionId ? this.positionId : '';
    this.fetchCandidates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['positionId'] && !changes['positionId'].isFirstChange()) {
      this.requestId = changes['positionId'].currentValue;
      this.fetchCandidates();
    }
  }

  fetchCandidates(): void {
    if (!this.initialLoader) this.loader = true;
    const url = `/candidate/list`
    let params = [
      `search=${this.searchKeyword}`,
      `page=${this.report ? '' : this.currentPage}`,
      `limit=${this.report ? '' : this.pageSize}`,
      `serviceRequestId=${this.requestId}`,
      `report=${this.report}`
    ].filter(param => param.split('=')[1] !== '').join('&');  // Filter out empty parameters
    if (this.report) {
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
              this.downloadAsExcel(jsonResponse.data, 'candidate_list.xlsx');
              this.loader = false;
            };
            this.loader = false;
            reader.readAsText(data);
          } else {
            this.downloadBlob(data, 'candidate_list.xlsx');
            this.loader = false;
          }
        },
        (error: any) => {
          this.loader = false;
          this.initialLoader = false;
        }
      );
      this.report = false;
      if (this.report === false) this.fetchCandidates();
      return;
    }
    this.apiService.get(`${url}?${params}`).subscribe((res: any) => {
      this.initialLoader = false;
      this.loader = false;
      this.data = res;
      this.candidateList = [];
      this.candidateList = res?.candidates;
      this.totalCount = res?.candidateCount;
      const totalPages = Math.ceil(this.totalCount / this.pageSize);
      this.lastPage = totalPages;
      if (this.currentPage > totalPages) this.currentPage = totalPages;
    }, (error: any) => {
      this.loader = false;
      this.initialLoader = false;
    });
  }

  exportData(): void {
    this.loader = true;
    this.report = true;
    this.fetchCandidates();
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

  onCandidateSelect(candidate: any): void {
    if (candidate.candidatesAddingAgainst !== null) this.toastr.warning('Candidate already added to requisition');
    else this.getSelectedCandidateIds();
  }

  getSelectedCandidateIds(): void {
    const selectedCandidates = this.candidateList.flat().filter((candidate: { isSelected: any; candidatesAddingAgainst: any }) => candidate.isSelected && candidate.candidatesAddingAgainst === null);
    this.candidates = selectedCandidates.map((candidate: { candidateId: any; resumeSourceId: any; }) => ({
      candidatesId: candidate?.candidateId,
      resumeSource: candidate?.resumeSourceId
    }));
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

  searchCandidate(search: string): void {
    this.searchKeyword = search;
    this.currentPage = 1;
    this.pageSize = 13;
    this.fetchCandidates();
  }

  clearFilter(): void {
    this.searchKeyword = '';
    this.currentPage = 1;
    this.pageSize = 13;
    this.fetchCandidates();
  }

  navigate(path: any, queryParam: any): void {
    if (queryParam) this.router.navigate([path], { queryParams: { type: queryParam } });
    else this.router.navigate([path]);
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, false);
  }

  delete(id: any): void {
    this.deleteCandidateId = id;
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: id,
      width: '500px',
      height: '250px'
    })
    dialogRef.componentInstance.onDeleteSuccess.subscribe(() => {
      this.apiService.post(`/candidate/remove-candidate`, { candidateId: this.deleteCandidateId }).subscribe({
        next: (res: any) => {
          this.currentPage = 1;
          this.pageSize = 13;
          this.fetchCandidates();
        },
        error: (error) => {
          this.toastr.error(error?.error?.message ? error?.error?.message : 'Unable to Delete candidates');
        }
      })
    })
  }

  edit(id: any): void {
    const dialogRef = this.dialog.open(EditComponent, {
      data: id,
      width: '950px',
      height: '700px'
    })
    dialogRef.componentInstance.onEditSuccess.subscribe(() => {
      this.currentPage = 1;
      this.pageSize = 13;
      this.fetchCandidates();
    })
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.pageSize = 13;
    this.fetchCandidates();
  }

  openRequisition(): void {
    if (this.candidates) {
      const dialogRef = this.dialog.open(AssignRequirementComponent, {
        height: '265px',
        width: '477px',
        data: { candidates: this.candidates, userId: this.userId }
      });
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        this.currentPage = 1;
        this.pageSize = 13;
        this.fetchCandidates();
      })
    } else this.toastr.warning('You have not selected candidates to assign');
  }

  selectCandidate(id: any): void {
    this.router.navigateByUrl(`/dashboard/candidate-details/${id}`);
  }
}
