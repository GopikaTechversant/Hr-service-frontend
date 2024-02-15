import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { ActivatedRoute } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ApprovalStatusService } from 'src/app/services/approval-status.service';
import { FeedbackComponent } from 'src/app/components/feedback/feedback.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css'],
  animations: [
    trigger('toggleAnimation', [
      state('visible', style({ width: '25%' })),
      state('hidden', style({ width: '0', transform: 'translateX(100%)' })),
      transition('visible => hidden', animate('.9s ease-out')), // Shorter duration for hiding
      transition('hidden => visible', animate('.5s ease-in-out')), // Longer duration for becoming visible
    ]),
  ],
})
export class SeriesComponent implements OnInit {
  @Input() rejectedCandidates: string[] = [];
  @Input() selectedCandidatesIds: string[] = [];
  series_list: any = [];
  activeSeries: any;
  candidates_list: any;
  series1: any = [];
  series2: any = [];
  series3: any = [];
  selectedCandidate: any;
  pointerPosition: any;
  dragEnteredSeries: any;
  candidates: any = [];
  biggieMoveSelected: boolean = false;
  activeBucket: any;
  requestId: any;
  isTaskDetailsOpen: boolean = false;
  serviceIds: any = [];
  approvedServiceId: any;
  candidateServiceId: any;
  constructor(private http: HttpClient, private route: ActivatedRoute, private dialog: MatDialog) {
    this.route.queryParams.subscribe(params => {
      this.requestId = params['requestId'];
    });
  }
  ngOnInit(): void {
    this.fetchcandidates();
  }
  fetchcandidates(): void {
    this.http.get(`${environment.api_url}/screening-station/list-batch/${this.requestId}`).subscribe((res: any) => {
      this.candidates_list = res.candidates;
      this.candidates = this.candidates.candidate;
      this.candidates_list.forEach((candidate: any) => {
        if (candidate.serviceId) {
          this.serviceIds.push(candidate.serviceId);
        }
      });
    })
  }
  seriesBoxClick(series: any) {
    this.series_list.forEach((s: any) => s.active = false);
    series.active = true;
    this.activeSeries = series;
  }
  allowDrop(ev: any) {
    ev.preventDefault();
  }
  onDrop(event: any) {
    this.selectedCandidate = event.item.data;
  }
  moved(event: any) {
    this.pointerPosition = event.pointerPosition;
  }
  createSeries(): void {
    const newSeriesName = `Series${this.series_list.length + 1}`;
    const newSeries = { name: newSeriesName };
    this.series_list.push(newSeries);
    this.activeSeries = newSeries;
  }
  dragStart(event: any, candidate: any) {
    event.dataTransfer.setData('text/plain', JSON.stringify(candidate));
  }
  dragOver(event: DragEvent) {
    event.preventDefault();
  }
  productDrop(event: any, series: any) {
    event.preventDefault();
    const candidateData = event.dataTransfer.getData('text/plain');
    const candidate = JSON.parse(candidateData);
    this.series_list.forEach((s: any) => {
      if (s?.candidates) {
        s.candidates = s.candidates.filter((c: any) => c?.candidateId !== candidate?.candidateId);
      }
    });
    this.candidates_list = this.candidates_list.filter((c: any) => c?.candidateId !== candidate?.candidateId);
    series.candidates = series.candidates || [];
    series.candidates.push(candidate);
    this.series_list = [...this.series_list];
  }
  dragOverSeries(event: DragEvent, series: any) {
    event.preventDefault();
    this.dragEnteredSeries = series;

  }
  approve(): void {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEyLCJ1c2VyVHlwZSI6ImFkbWluIiwidXNlckVtYWlsIjoiYWRtaW5AbWFpbGluYXRvci5jb20ifQ.Uva57Y4MMA0yWz-BYcRD-5Zzth132GMGJkFVQA3Tn50'
    });
    const requestData = {
      serviceIds: this.selectedCandidatesIds.length > 0 ? this.selectedCandidatesIds : this.serviceIds
    }
    this.http.post(`${environment.api_url}/screening-station/accept`, requestData, { headers }).subscribe((res: any) => {
      alert("approved");
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
