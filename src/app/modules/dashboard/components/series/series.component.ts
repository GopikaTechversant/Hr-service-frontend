import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedbackComponent } from 'src/app/components/feedback/feedback.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrServices } from 'src/app/services/toastr.service';
import { ApiService } from 'src/app/services/api.service';
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
  requirementDetails:any;
  constructor(private apiService: ApiService, private http: HttpClient, private router: Router, private route: ActivatedRoute, private dialog: MatDialog, private tostr: ToastrServices, private renderer: Renderer2) {
    this.route.queryParams.subscribe(params => {
      this.requestId = params['requestId'];
    });
  }

  ngOnInit(): void {
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

  fetchDetails():void{
    this.apiService.get(`/service-request/view?requestId=${this.requestId}`).subscribe((res:any) => {
      console.log("data fetch",res);
      if(res?.data) this.requirementDetails = res?.data;
      console.log("this.requirementDetails",this.requirementDetails);
      
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

}
