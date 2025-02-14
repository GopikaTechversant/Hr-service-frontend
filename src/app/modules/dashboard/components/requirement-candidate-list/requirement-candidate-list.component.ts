import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteComponent } from 'src/app/components/delete/delete.component';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
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
  status: any[] = ['Active Requisitions', 'Closed Requisitions'];
  userType: any;
  userRole:any;
  candidates: any;
  constructor(private router: Router, private apiService: ApiService, private dialog: MatDialog, private toastr: ToastrService) { }
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
    this.fetchcandidates(this.currentPage,'');
  }

  fetchcandidates(page:any,searchQuery: string): void {
    if(page) this.currentPage = page;
    console.log("page",page);
    console.log("searchQuery",searchQuery);
    
    const isActive = this.filteredStatus === 'Closed Requisitions' ? 'closed' : 'active';
    if (!this.initialLoader) this.loader = true
    this.apiService.get(`/screening-station/v1/list-all?page=${this.currentPage}&limit=${this.limit}&search=${searchQuery.trim()}&isActive=${isActive}`).subscribe((res: any) => {
      if (res) {
        this.initialLoader = false;
        this.loader = false
        this.candidates_list = res?.candidates;
        this.totalCount = res?.totalCount;
        const totalPages = Math.ceil(this.totalCount / this.limit);
        this.lastPage = totalPages;
        if (this.currentPage > totalPages) this.currentPage = totalPages;
      }
    }, (error: any) => {
      this.loader = false;
      this.initialLoader = false;
    });
  }

  requirementSearch(search: any): void {
    this.searchKeyword = search;
    this.currentPage = 1;
    this.limit = 15;
    this.fetchcandidates(this.currentPage,this.searchKeyword);
  }

  navigate(path: any, requestId?: any): void {
    const queryParams = requestId ? { requestId: requestId } : undefined;
    if (queryParams) this.router.navigate([path], { queryParams: queryParams });
    else this.router.navigate([path]);
  }

  onStatusChange(candidate: any): void {
    this.router.navigate(['dashboard/add-candidate'], {
      state: { candidate }
    });
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
          this.fetchcandidates(this.currentPage,'');
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
    sessionStorage.setItem('requisition', this.filteredStatus);
    this.currentPage = 1;
    this.limit = 15;
    this.fetchcandidates(this.currentPage,'');
  }

  clearFilter(item: any): void {
    if (item === 'search') this.searchKeyword = '';
    if (item === 'status') {
      this.filteredStatus = 'Active Requisitions';
      sessionStorage.setItem('requisition', this.filteredStatus);
    }
    this.currentPage = 1;
    this.limit = 15;
    this.fetchcandidates(this.currentPage,'');
  }

  onCandidateSelect(candidate: any): void {
    // if (candidate.candidatesAddingAgainst !== null) this.toastr.warning('Candidate already added to requisition');
    // else this.getSelectedCandidateIds();
    this.getSelectedCandidateIds()
  }

  getSelectedCandidateIds(): void {
    const selectedCandidates = this.candidates_list.flat().filter((candidate: { isSelected: any; candidatesAddingAgainst: any }) => candidate.isSelected && candidate.candidatesAddingAgainst === null);
    this.candidates = selectedCandidates.map((candidate: { candidateId: any; resumeSourceId: any; }) => ({
      candidatesId: candidate?.candidateId,
      resumeSource: candidate?.resumeSourceId
    }));
  }

  exportData(): void {
    this.loader = true;
    // this.report = true;
    // this.fetchCandidates(this.currentPage);
  }

}
