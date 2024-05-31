import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedbackComponent } from 'src/app/components/feedback/feedback.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrServices } from 'src/app/services/toastr.service';
import { ApiService } from 'src/app/services/api.service';
import { EditRequirementComponent } from '../edit-requirement/edit-requirement.component';
import { DeleteComponent } from 'src/app/components/delete/delete.component';
@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css'],

})
export class SeriesComponent implements OnInit {
  @Input() rejectedCandidates: string[] = [];
  @Input() selectedCandidatesIds: string[] = [];
  @ViewChild('scrollTop') private scrollTop: ElementRef | undefined;

  candidates_list: any;
  selectedCandidate: any;
  candidates: any = [];
  requestId: any;
  isTaskDetailsOpen: boolean = false;
  serviceIds: any = [];
  approvedServiceId: any;
  candidateServiceId: any;
  error: boolean = false;
  moreApiCalled: boolean = false;
  limit: number = 12;
  page: number = 1;
  showDropdown: boolean = false;
  requirement_details: any = {};
  editRequirement: any;
  deleteRequirementId: any;
  flows: any[] = [];
  roundNames: any;
  initialLoader:boolean = false
  currentPage: number = 1;
  lastPage: any;
  totalCount: any;
  constructor(private apiService: ApiService, private http: HttpClient, private router: Router, private route: ActivatedRoute, private dialog: MatDialog, private tostr: ToastrServices, private renderer: Renderer2) {
    this.route.queryParams.subscribe(params => {
      this.requestId = params['requestId'];
    });
  }

  ngOnInit(): void {
    // this.initialLoader = true;
    this.fetchDetails();
    this.fetchcandidates();
  }

  ngAfterViewInit() {
    if (this.scrollTop) {
      this.renderer.listen(this.scrollTop.nativeElement, 'scroll', (event) => {
        let element = event.target;
        const requiredHeight = element.scrollTop + element.clientHeight;
        let calculatedHeight = element.scrollHeight / 4;
        calculatedHeight = calculatedHeight * 3;
        if (requiredHeight > calculatedHeight && !this.moreApiCalled) this.loadMore();
      });
    }
  }

  fetchcandidates(): void {
    this.apiService.get(`/screening-station/list-batch/${this.requestId}?limit=${this.limit}&page=1`).subscribe((res: any) => {
      this.moreApiCalled = false;
      if (res?.candidates) {
        this.candidates_list = res?.candidates
        this.candidates_list = [];
        this.candidates_list = [...this.candidates_list, ...res?.candidates];
        this.candidates_list.forEach((candidate: any) => {
          if (candidate.serviceId) this.serviceIds.push(candidate?.serviceId);
        });
        
      }
    })
  }

  fetchDetails(): void {
    this.apiService.get(`/service-request/view?requestId=${this.requestId}`).subscribe((res: any) => {
      console.log("data fetch", res);
      if (res?.data) this.requirement_details = res?.data;
      if (res?.flows) this.flows = res?.flows;
      this.roundNames = this.flows.map(flow => flow.flowStationName).join(', ');
    })
  }

  loadMore(): void {
    if (!this.moreApiCalled) {
      this.moreApiCalled = true;
      this.limit = this.limit + 3
      this.fetchcandidates();
    }
  }

  toggleTaskDetails() {
    this.isTaskDetailsOpen = !this.isTaskDetailsOpen;
  }

  onStatusChange(event: any, candidate: any): void {
    const selectedStatus = event?.target?.value;
    if (selectedStatus === 'reject') this.onCandidateSelectionChange(candidate);
    if (selectedStatus === 'select') {
      this.router.navigate(['dashboard/interview-details'], {
        state: { candidate }
      });
    }
  }

  onCandidateSelectionChange(candidate: any): void {
    this.candidateServiceId = candidate?.serviceId;
    const userId = localStorage.getItem('userId');
    const dialogRef = this.dialog.open(FeedbackComponent, {
      data: { candidateId: candidate?.serviceId, stationId: 1, status: 'rejected', candidateDetails: candidate, userId: userId },
      width: '600px',
      height: '300px'
    })

    dialogRef.afterClosed().subscribe(() => {
      this.fetchcandidates();
    });
  }

  edit(requirement: any): void {
    this.editRequirement = requirement;
    const dialogRef = this.dialog.open(EditRequirementComponent, {
      data: this.editRequirement,
      width: '50%',
      height: '80%'
    })
    dialogRef.componentInstance.onEditSuccess.subscribe(() => {
      this.limit = 9;
      this.fetchDetails();
      this.fetchcandidates()
    })
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
          // this.generatePageNumbers();
          this.fetchDetails();
          this.fetchcandidates()

        },
        error: (error) => {
          this.tostr.error(error?.error?.message ? error?.error?.message : 'Unable to Delete candidates');
        }
      })
    })
  }

  selectCandidate(id: any): void {
    this.router.navigateByUrl(`/dashboard/candidate-details/${id}`);
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.fetchcandidates();
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
