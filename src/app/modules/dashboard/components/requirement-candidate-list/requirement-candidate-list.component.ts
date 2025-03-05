import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteComponent } from 'src/app/components/delete/delete.component';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { ExportService } from 'src/app/services/export.service';
@Component({
  selector: 'app-requirement-candidate-list',
  templateUrl: './requirement-candidate-list.component.html',
  styleUrls: ['./requirement-candidate-list.component.css'],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
})
export class RequirementCandidateListComponent implements OnInit {
  candidates_list: any = [];
  searchKeyword: string = '';
  limit = 15;
  currentPage = 1;
  showFirstLastButtons = true;
  totalCount: any;
  lastPage: any;
  initialLoader: boolean = false;
  loader: boolean = false;
  deleteRequirementId: any;
  editRequirement: any;
  filterStatus: boolean = false;
  filteredStatus: any = '';
  status: any[] = ['All Requisitions','Active Requisitions', 'Closed Requisitions', 'Pending Requisitions'];
  userType: any;
  userRole: any;
  requisitionids: any;
  report: boolean = false;
  idsParams: any;
  constructor(private router: Router, private apiService: ApiService, private dialog: MatDialog, private toastr: ToastrService, private exportService: ExportService) { }
  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.filterStatus = false;
    }
  }
  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.userRole = localStorage.getItem('userRole');
    this.initialLoader = true;
    this.filteredStatus = sessionStorage.getItem('requisition') ? sessionStorage.getItem('requisition') : 'Active Requisitions';
    // Retrieve the last page from localStorage (if available)
    const savedPage = localStorage.getItem('currentPage');
    this.currentPage = savedPage ? parseInt(savedPage, 10) : 1;

    this.filteredStatus = localStorage.getItem('requisition')
      ? localStorage.getItem('requisition')
      : 'Active Requisitions';
    this.fetchcandidates(this.currentPage, '');

  }

  // fetchcandidates(page: any, searchQuery: string): void {
  //   if (page) this.currentPage = page;
  //   console.log("page", page);
  //   console.log("searchQuery", searchQuery);

  //   const isActive = this.filteredStatus === 'Closed Requisitions' ? 'closed' : 'active';
  //   if (!this.initialLoader) this.loader = true
  //   this.apiService.get(`/screening-station/v1/list-all?page=${this.currentPage}&limit=${this.limit}&search=${searchQuery.trim()}&isActive=${isActive}&report=${this.report}`).subscribe((res: any) => {
  //     if (res) {
  //       this.initialLoader = false;
  //       this.loader = false
  //       this.candidates_list = res?.candidates;
  //       this.totalCount = res?.totalCount;
  //       const totalPages = Math.ceil(this.totalCount / this.limit);
  //       this.lastPage = totalPages;
  //       if (this.currentPage > totalPages) this.currentPage = totalPages;
  //       localStorage.setItem('currentPage', this.currentPage.toString());

  //     }
  //   }, (error: any) => {
  //     this.loader = false;
  //     this.initialLoader = false;
  //   });
  // }
  fetchcandidates(page: any, searchQuery: string): void {
    if (page) this.currentPage = page;
    console.log("page", page);
    console.log("searchQuery", searchQuery);
    // const isActive = this.filteredStatus === 'Closed Requisitions' ? 'closed' : 'active';
    const isActive = this.filteredStatus === 'Closed Requisitions' 
    ? 'closed' 
    : this.filteredStatus === 'Pending Requisitions' 
    ? 'pending' 
    : this.filteredStatus === 'Active Requisitions' 
    ? 'active' 
    : '';
  
    console.log("isActive:", isActive);
    if (!this.initialLoader) this.loader = true
    const url = `/screening-station/v1/list-all`;
    let params = [
      `page=${this.report ? '' : this.currentPage}`,
      `limit=${this.report ? '' : this.limit}`,
      `search=${searchQuery.trim()}`,
      `isActive=${isActive}`,
      `report=${this.report}`,
      // `ids=${this.idsParams ? this.idsParams : ''}`
    ].filter(param => param.split('=')[1] !== '').join('&');  // Filter out empty parameters
    if (this.report) {
      if (this.requisitionids) {
        this.idsParams = this.requisitionids.map((id: string) => `ids=${id}`).join('&');
        params += `&${this.idsParams}`;
      }
      const exportUrl = `${url}?${params}`;
      this.apiService.getTemplate(exportUrl).subscribe(
        (data: Blob) => {
          if (data.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (event) => {
              const text = event.target?.result as string;
              const jsonResponse = JSON.parse(text);
              this.downloadAsExcel(jsonResponse.data, 'requisition_list.xlsx');
              this.loader = false;
            };
            this.loader = false;
            reader.readAsText(data);
          } else {
            this.downloadBlob(data, 'requisition_list.xlsx');
            this.loader = false;
          }
        },
        (error: any) => {
          this.loader = false;
          this.initialLoader = false;
        }
      );
      this.report = false;
      if (this.report === false) this.fetchcandidates('', '');
      return;
    }
    this.apiService.get(`${url}?${params}`).subscribe((res: any) => {
      this.initialLoader = false;
      this.loader = false
      this.candidates_list = res?.candidates;
      this.totalCount = res?.totalCount;
      const totalPages = Math.ceil(this.totalCount / this.limit);
      this.lastPage = totalPages;
      if (this.currentPage > totalPages) this.currentPage = totalPages;
      localStorage.setItem('currentPage', this.currentPage.toString());
    }, (error: any) => {
      this.loader = false;
      this.initialLoader = false;
    });
  }

  requirementSearch(search: any): void {
    this.searchKeyword = search;
    this.currentPage = 1;
    this.limit = 15;
    this.fetchcandidates(this.currentPage, this.searchKeyword);
  }

  navigate(path: any, requestId?: any): void {
    const queryParams = requestId ? { requestId: requestId } : undefined;
    if (queryParams) this.router.navigate([path], { queryParams: queryParams });
    else this.router.navigate([path]);
  }

  // onStatusChange(candidate: any): void {
  //   this.router.navigate(['dashboard/add-candidate'], {
  //     state: { candidate }
  //   });
  // }
  onStatusChange(candidate: any): void {
    if (candidate?.status === 'active') {
      this.router.navigate(['dashboard/add-candidate'], {
        state: { candidate }
      });
    } else this.toastr.warning('Unable to add candidate: Requisition Inactive');

  }

  delete(id: any): void {
    this.deleteRequirementId = id;
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: this.deleteRequirementId,
      width: '500px',
      height: '250px'
    })
    dialogRef.componentInstance.onDeleteSuccess.subscribe(() => {
      this.apiService.post(`/service-request/delete`, { requestId: this.deleteRequirementId }).subscribe({
        next: (res: any) => {
          this.fetchcandidates(this.currentPage, '');
          this.toastr.success('Deleted succesfully')
        },
        error: (error) => {
          this.toastr.error(error?.error?.message ? error?.error?.message : 'Unable to Delete candidates');
        }
      })
    })
  }

  selectStatusFilter(item: string): void {
    this.filteredStatus = item;
    console.log("this.filteredStatus", this.filteredStatus);
    sessionStorage.setItem('requisition', this.filteredStatus);
    this.currentPage = 1;
    this.limit = 15;
    this.fetchcandidates(this.currentPage, '');
  }

  clearFilter(item: any): void {
    if (item === 'search') this.searchKeyword = '';
    if (item === 'status') {
      this.filteredStatus = 'Active Requisitions';
      sessionStorage.setItem('requisition', this.filteredStatus);
    }
    this.currentPage = 1;
    this.limit = 15;
    this.fetchcandidates(this.currentPage, '');
  }

  getSelectedCandidateIds(): void {
    const selectedCandidates = this.candidates_list.flat().filter((candidate: { isSelected: any; }) => candidate.isSelected);
    console.log("selectedCandidates", selectedCandidates);
    this.requisitionids = selectedCandidates.map((requisition: { requestId: any; }) => requisition?.requestId);
    console.log(" this.candidateIds", this.requisitionids);
  }

  exportData(): void {
    this.loader = true;
    this.report = true;
    this.fetchcandidates(this.currentPage, '');
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
}
