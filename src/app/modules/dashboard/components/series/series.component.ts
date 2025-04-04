import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastrServices } from 'src/app/services/toastr.service';
import { ApiService } from 'src/app/services/api.service';
import { DeleteComponent } from 'src/app/components/delete/delete.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { FeedbackComponent } from 'src/app/components/feedback/feedback.component';
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
  requirement_details: any;
  editRequirement: any;
  deleteRequirementId: any;
  flows: any[] = [];
  roundNames: any;
  initialLoader: boolean = false;
  loader: boolean = false;
  currentPage: number = 1;
  lastPage: any;
  pageSize = 10;
  searchKeyword: string = '';
  formattedText: SafeHtml | undefined;
  env_url: string = '';
  isExpanded: boolean = false;
  showViewMore: boolean = false;
  userType: any;
  userRole: any;
  @ViewChild('template') set templateSetter(template: ElementRef) {
    if (template) {
      this.template = template;
      this.updateHeight()
    }
  }
  template: ElementRef | undefined;
  constructor(private apiService: ApiService, private toastr: ToastrService, private router: Router,
    private route: ActivatedRoute, private dialog: MatDialog, private tostr: ToastrServices,
    private renderer: Renderer2, private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) {

    this.route.queryParams.subscribe(params => {
      this.requestId = params['requestId'];
    });
  }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.userRole = localStorage.getItem('userRole');
    this.initialLoader = true;
    this.fetchDetails();
    this.env_url = window.location.origin;
  }

  fetchDetails(): void {
    this.apiService.get(`/service-request/view?requestId=${this.requestId}`).subscribe({
      next: (res: any) => {
        if (res?.data) {
          this.requirement_details = res?.data;
          const text = this.requirement_details?.requestDescription;
          this.formattedText = this.sanitizer.bypassSecurityTrustHtml(text);
        }
        if (res?.flows) {
          this.flows = res?.flows;
          this.roundNames = this.flows
            .map(flow => flow.flowStationName === 'HR Manager' ? 'HR' : flow.flowStationName)
            .join(', ');
        }
        this.initialLoader = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.initialLoader = false;
      }
    });
  }

  updateHeight(): void {
    if (this.template) {
      const height = this.template.nativeElement.offsetHeight;
      if (height >= 200) {
        this.showViewMore = true;
      }
    }

  }

  toggleView() {
    this.isExpanded = !this.isExpanded;
  }

  edit(path: any, requestId?: any): void {
    const queryParams = requestId ? { requestId: requestId } : undefined;
    if (queryParams) this.router.navigate([path], { queryParams: queryParams });
    else this.router.navigate([path]);
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
          this.fetchDetails();
          this.toastr.success('Deleted succesfully')
        },
        error: (error) => {
          this.tostr.error(error?.error?.message ? error?.error?.message : 'Unable to Delete candidates');
        }
      })
    })
  }

  approveRequisition(id: any): void {
    const payload = {
      requestionId: id,
      approve: true,
      reason: ''
    }
    this.apiService.post(`/service-request/activateRequest`, payload).subscribe({
      next: (res: any) => {
        this.tostr.success('Approved');
        this.router.navigate(['/dashboard/requirement-candidate-list']);
      },
      error: (error) => {
        this.tostr.error('Unable to approve');
      }
    })

  }

  rejectRequisition(id: any): void {
    const dialogRef = this.dialog.open(FeedbackComponent, {
      data: { rejectStatus: 'rejectRequisition', rejectionRequsitionId: id },
      width: '650px',
      height: '260px'
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === true) {
        this.router.navigate(['/dashboard/requirement-candidate-list']);
      }
    });
  }

}
