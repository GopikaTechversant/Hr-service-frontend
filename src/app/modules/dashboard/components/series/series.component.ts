import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { ActivatedRoute } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ApprovalStatusService } from 'src/app/services/approval-status.service';
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
  // series_list: any = [{ name: 'Series1' }]
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
  constructor(private http: HttpClient, private route: ActivatedRoute,private approvalStatusService: ApprovalStatusService) {

    this.route.queryParams.subscribe(params => {
      this.requestId = params['requestId'];
      console.log(" this.requestId", this.requestId);


    });
  }
  ngOnInit(): void {
    this.fetchcandidates();
    // console.log("this.series_list before", this.series_list);
  }
  fetchcandidates(): void {
    this.http.get(`${environment.api_url}/screening-station/list-batch/${this.requestId}`).subscribe((res: any) => {
      // console.log("fetch candidates", res);
      this.candidates_list = res.candidates;
      this.candidates = this.candidates.candidate;
      // console.log("this.candidates_list", this.candidates_list);
      this.candidates_list.forEach((candidate: any) => {
        if (candidate.serviceId) {
          this.serviceIds.push(candidate.serviceId);
        }
        // console.log("Service IDs:", this.serviceIds);
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
    // console.log("hhfudghfui");

    this.selectedCandidate = event.item.data;
    // console.log("this.selectedCandidate", this.selectedCandidate);

  }
  moved(event: any) {
    // console.log("entering pointer position");

    this.pointerPosition = event.pointerPosition;
    // console.log(event.pointerPosition);
  }
  itemDropped(event: any, series: any) {

    // console.log("item dropped");

  }

  createSeries(): void {

    // const newSeriesName = this.series_list.name++;
    const newSeriesName = `Series${this.series_list.length + 1}`;
    // console.log("newSeriesName", newSeriesName);

    const newSeries = { name: newSeriesName };
    // console.log("newSeries", newSeries);

    this.series_list.push(newSeries);
    // console.log("after this.series_list", this.series_list);

    this.activeSeries = newSeries;
  }
  dragStart(event: any, candidate: any) {
    // console.log("Drag Start");
    event.dataTransfer.setData('text/plain', JSON.stringify(candidate));

  }

  dragOver(event: DragEvent) {
    // console.log("Drag Over Series");
    event.preventDefault();
  }

  productDrop(event: any, series: any) {
    // console.log("Product Drop Series");
    event.preventDefault();
    const candidateData = event.dataTransfer.getData('text/plain');
    const candidate = JSON.parse(candidateData);

    // Remove the candidate from its previous series
    this.series_list.forEach((s: any) => {
      if (s?.candidates) {
        s.candidates = s.candidates.filter((c: any) => c?.candidateId !== candidate?.candidateId);
      }
    });

    // Remove the candidate from the candidates_list
    this.candidates_list = this.candidates_list.filter((c: any) => c?.candidateId !== candidate?.candidateId);

    // Add the dropped candidate to the candidates array of the new series
    series.candidates = series.candidates || [];
    series.candidates.push(candidate);

    // Update the series_list
    this.series_list = [...this.series_list];
    // console.log("Candidate dropped:", candidate);
    // console.log("Dropped into Series:", series);
    // console.log("Series with Candidates:", this.series_list);
  }

  // Handle the dragover event for the series boxes
  dragOverSeries(event: DragEvent, series: any) {
    event.preventDefault();
    this.dragEnteredSeries = series;

  }
  approve(): void {
    const requestData = {
      serviceIds: this.serviceIds
    }
    this.http.post(`${environment.api_url}/screening-station/accept`, requestData).subscribe((res: any) => {
      // console.log("approve seriies", res);
      alert("Approved")
      this.approvalStatusService.updateapprovalStatus(true);

    },
    (error) => {
      // console.log("error in approving candidates");
      this.approvalStatusService.updateapprovalStatus(false);
      
    }
    )

  }

  toggleTaskDetails() {
    // if (this.isTaskDetailsOpen) {
    this.isTaskDetailsOpen = !this.isTaskDetailsOpen;
    // } else {
    // this.isTaskDetailsOpen = !this.isTaskDetailsOpen;
    // }
  }
}
