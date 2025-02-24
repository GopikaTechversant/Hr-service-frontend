import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedbackComponent } from 'src/app/components/feedback/feedback.component';
import { ApiService } from 'src/app/services/api.service';
import { InterviewDetailsComponent } from '../interview-details/interview-details.component';
import { DeleteComponent } from 'src/app/components/delete/delete.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-candidate-schedule',
  templateUrl: './candidate-schedule.component.html',
  styleUrls: ['./candidate-schedule.component.css']
})
export class CandidateScheduleComponent implements OnInit {
  requestId: any;
  initialLoader: boolean = false;
  loader: boolean = false;
  currentPage: number = 1;
  lastPage: any;
  pageSize = 10;
  limit: number = 12;
  candidates_list: any;
  serviceIds: any = [];
  searchKeyword: string = '';
  candidateServiceId: any;
  totalCount: any;
  userType:any;
  constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService, private dialog: MatDialog ,private toastr : ToastrService) {
    this.route.queryParams.subscribe(params => {
      this.requestId = params['requestId'];
    });
  }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType')
    this.initialLoader = true;
    this.fetchcandidates(this.currentPage);
  }

  fetchcandidates(page:any): void {
    if(page) this.currentPage = page;
    if (!this.initialLoader) this.loader = true;
    this.apiService.get(`/screening-station/list-batch/${this.requestId}?limit=${this.limit}&page=${this.currentPage}&search=${this.searchKeyword}`).subscribe((res: any) => {
      if (res?.candidates) {
        this.initialLoader = false;
        this.loader = false;
        this.candidates_list = res?.candidates
        this.candidates_list = [];
        this.candidates_list = [...this.candidates_list, ...res?.candidates];
        this.totalCount = res?.candidateCount;
        const totalPages = Math.ceil(this.totalCount / this.limit);
        this.lastPage = totalPages;
        if (this.currentPage > totalPages) this.currentPage = totalPages;
        this.candidates_list.forEach((candidate: any) => {
          if (candidate.serviceId) this.serviceIds.push(candidate?.serviceId);
        });
      }
    }, (error: any) => {
      this.loader = false;
      this.initialLoader = false;
    });
  }

  selectCandidate(id: any): void {
    this.router.navigateByUrl(`/dashboard/candidate-details/${id}`);
  }

  searchCandidate(search: string): void {
    this.searchKeyword = search;
    this.currentPage = 1;
    this.pageSize = 10;
    this.fetchcandidates(this.currentPage);
  }

  clearFilter(): void {
    this.searchKeyword = '';
    this.currentPage = 1;
    this.pageSize = 10;
    this.fetchcandidates(this.currentPage);
  }

  onStatusChange(event: any, candidate: any): void {
    const selectedStatus = event?.target?.value;
    const userId = localStorage.getItem('userId');
    if (selectedStatus === 'reject') this.onCandidateSelectionChange(candidate);
    if (selectedStatus === 'select') {
      const dialogRef = this.dialog.open(InterviewDetailsComponent, {
        data: { candidate },
        width: '600px',
        height: '280px'
      })
      dialogRef.afterClosed().subscribe(() => {
        this.fetchcandidates(this.currentPage);
      });
    }
  }

  deleteCandidate(candidateId: any , serviceId: any): void {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: candidateId,
      width: '500px',
      height: '250px',
    });
  
    dialogRef.componentInstance.onDeleteSuccess.subscribe(() => {
      this.apiService
        .put(`/screening-station/unmapp/candidate?serviceId=${serviceId}&candidateId=${candidateId}`, {})
        .subscribe({
          next: (res: any) => {
            this.toastr.success('User removed');
            this.fetchcandidates(this.currentPage);
          },
          error: (error) => {
            this.toastr.error(error?.error?.message ? error?.error?.message : 'Unable to Delete candidates');
            this.fetchcandidates(this.currentPage);
          },
        });
    });
  }
  
  onCandidateSelectionChange(candidate: any): void {
    this.candidateServiceId = candidate?.serviceId;
    const userId = localStorage.getItem('userId');
    const dialogRef = this.dialog.open(FeedbackComponent, {
      data: { candidateId: candidate?.serviceId, stationId: 1, status: 'rejected', candidateDetails: candidate, userId: userId },
      width: '700px',
      height: '360px'
    })
    dialogRef.afterClosed().subscribe(() => {
      this.fetchcandidates(this.currentPage);
    });
  }
}
