import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { ActivatedRoute } from '@angular/router';
import { FeedbackComponent } from 'src/app/components/feedback/feedback.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrServices } from 'src/app/services/toastr.service';
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
  limit: number = 9;
  page:number = 1;
  constructor(private http: HttpClient, private route: ActivatedRoute, private dialog: MatDialog, private tostr: ToastrServices, private renderer: Renderer2) {
    this.route.queryParams.subscribe(params => {
      this.requestId = params['requestId'];
    });
  }
  ngOnInit(): void {
    this.fetchcandidates();
  
  }
  ngAfterViewInit() {
    console.log("cyuhgdy");

    if (this.scrollTop) {
      this.renderer.listen(this.scrollTop.nativeElement, 'scroll', (event) => {
        console.log("scrollTop");
        let element = event.target;
        const requiredHeight = element.scrollTop + element.clientHeight;
        let calculatedHeight = element.scrollHeight / 4;
        calculatedHeight = calculatedHeight * 3;
        console.log("calculatedHeight ",calculatedHeight );
        console.log("requiredHeight",requiredHeight);
        
        if (requiredHeight > calculatedHeight && !this.moreApiCalled) this.loadMore();
      });
    }

  }


  fetchcandidates():void{
    this.http.get(`${environment.api_url}/screening-station/list-batch/${this.requestId}?limit=${this.limit}&page=1`).subscribe((res:any) => {
      this.moreApiCalled = false;
      if(res?.candidates){
        this.candidates_list = res?.candidates
        this.candidates_list =[...this.candidates_list, ...res.candidates];
        this.candidates_list.forEach((candidate: any) => {
          if(candidate.serviceId) {
            this.serviceIds.push(candidate.serviceId);
          }
        });
      }
    })
  }
  
  loadMore(): void {
    if (!this.moreApiCalled) {
      this.moreApiCalled = true;
      this.limit = this.limit + 3
      this.fetchcandidates();
    }
  }
  
  approve(): void {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEyLCJ1c2VyVHlwZSI6ImFkbWluIiwidXNlckVtYWlsIjoiYWRtaW5AbWFpbGluYXRvci5jb20ifQ.Uva57Y4MMA0yWz-BYcRD-5Zzth132GMGJkFVQA3Tn50'
    });
    const requestData = {
      serviceIds: this.selectedCandidatesIds.length > 0 ? this.selectedCandidatesIds : this.serviceIds
    }
    this.http.post(`${environment.api_url}/screening-station/accept`, requestData, { headers }).subscribe({
      next: (res: any) => {
        this.tostr.success('Approved');

      },
      error: (error) => {
        if (error?.status === 500) this.tostr.error("Internal Server Error");
        else {
          this.tostr.warning(error?.error?.message ? error?.error?.message : "Unable to fetch details");
          this.error = true;
        }
      }
    }
    )
  }
  toggleTaskDetails() {
    this.isTaskDetailsOpen = !this.isTaskDetailsOpen;
  }
  onCandidateSelectionChange(event: any, candidate: any, index: any): void {
    let action = event?.target?.value;
    this.candidateServiceId = candidate?.serviceId;
    const dialogRef = this.dialog.open(FeedbackComponent, {
      data: { candidateId: candidate?.serviceId, stationId: 1, status: action },
      width: '400px',
      height: '200px'
    })
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        candidate.serviceStatus = action;
      }
      console.log(candidate)
      let element: any = document.getElementById('status' + index);
      if (element) element.value = candidate.serviceStatus;
    })
    dialogRef.componentInstance.selectedCandidatesEmitter.subscribe((selectedCandidatesIds: any[]) => {
      this.selectedCandidatesIds.push(...selectedCandidatesIds);
    })
  }
}
