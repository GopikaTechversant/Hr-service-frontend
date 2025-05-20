import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { StationCandidateDetailComponent } from '../station-candidate-detail/station-candidate-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { StationSwitchComponent } from '../station-switch/station-switch.component';
import { WarningBoxComponent } from '../warning-box/warning-box.component';
import { HrCandidateDetailComponent } from 'src/app/modules/hr-station/components/hr-candidate-detail/hr-candidate-detail.component';

@Component({
  selector: 'app-candidate-actions',
  templateUrl: './candidate-actions.component.html',
  styleUrls: ['./candidate-actions.component.css']
})
export class CandidateActionsComponent implements OnInit {
  @Input() candidateId: any;
  @Output() switchStation = new EventEmitter<any>();
  @Output() viewDetails: EventEmitter<{ id: any, status: any }> = new EventEmitter<{ id: any, status: any }>();
  @Output() modalClosed = new EventEmitter<boolean>();
  userType: any;
  initialLoader: boolean = false;
  loader: boolean = false;
  candidateDetails: any;
  modalClose: boolean = false;
  stationId: any;
  constructor(private apiService: ApiService, private dialog: MatDialog) {

  }
  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.fetchCandidateDetails();
  }

  fetchCandidateDetails(): void {
    this.apiService.get(`/screening-station/candidate/progress?candidateId=${this.candidateId}`).subscribe((res: any) => {
      this.candidateDetails = res?.candidates;
    })
  }

  onSwitchStation(candidate: any): void {
    // console.log(candidate,"candidate");
    
    this.stationId = candidate?.serviceStation.toString();
    this.modalClose = false;
    if (candidate?.serviceStatus === 'pending') {
      const userId = localStorage.getItem('userId');
      const dialogRef = this.dialog.open(StationSwitchComponent, {
        data: {
          userId: userId,
          name: candidate['candidate.candidateFirstName'] + ' ' + candidate['candidate.candidateLastName'],
          serviceId: candidate?.serviceId,
          currentStation: candidate?.currentStation,
          currentStationId: this.stationId,
          requirement: candidate['serviceRequest.requestName'],
          assignee: candidate?.serviceAssignee
        },
      })
      dialogRef.afterClosed().subscribe(() => {
        this.modalClose = true;
        this.fetchCandidateDetails();
      });
    } else {
      const dialogRef = this.dialog.open(WarningBoxComponent, {})
      dialogRef.afterClosed().subscribe(() => {
        this.modalClose = true;
      });
    }
  }


  fetchDetails(details: any, statusProgress: any, offerStatus: any): void {
    const id = details?.serviceId;
    const status = statusProgress;
    this.stationId = details?.serviceStation.toString();
    // console.log("this.stationId", this.stationId);

    // console.log("details", details);
    if (this.stationId === '2') {
      this.apiService.get(`/written-station/progressDetail?serviceId=${id}`).subscribe((data: any) => {
        // console.log("data", data);

        if (data?.candidates) this.viewCandidateDetail(data?.candidates, status, '');
      });
    } else if (this.stationId === '3') {
      this.apiService.get(`/technical-station/progressDetail?serviceId=${id}`).subscribe((data: any) => {
        // console.log("data", data);
        if (data?.candidates) this.viewCandidateDetail(data?.candidates, status, '');
      });
    } else if (this.stationId === '4') {
      this.apiService.get(`/technical-station-two/progressDetail?serviceId=${id}`).subscribe((data: any) => {
        // console.log("data", data);
        if (data?.candidates) this.viewCandidateDetail(data?.candidates, status, '');
      });
    } else if (this.stationId === '5') {
      this.apiService.get(`/hr-station/candidateDetail?serviceId=${id}`).subscribe((data: any) => {
        if (data?.candidates) this.viewCandidateDetail(data?.candidates, status, offerStatus);
      });
    }
  }

  viewCandidateDetail(item: any, status: any, offerStatus: any): void {
    this.modalClose = false;
    if (this.stationId === '5') {
      const dialogRef = this.dialog.open(HrCandidateDetailComponent, {
        data: { candidateDetails: item, offerStatus: offerStatus, reviewStatus: status },
      })
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        this.modalClose = true;
        this.fetchCandidateDetails();
        this.modalClosed.emit(true);
      })
    } else {
      const dialogRef = this.dialog.open(StationCandidateDetailComponent, {
        data: { candidateDetails: item, offerStatus: status, currentStation: item?.currentStation, stationId: item?.serviceStation },
      })
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        this.modalClose = true;
        this.fetchCandidateDetails();
        this.modalClosed.emit(true);
      })
    }
  }

}
