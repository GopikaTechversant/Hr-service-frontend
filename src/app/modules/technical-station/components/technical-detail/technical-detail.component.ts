import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { StationSwitchComponent } from 'src/app/components/station-switch/station-switch.component';
import { WarningBoxComponent } from 'src/app/components/warning-box/warning-box.component';
import { StationCandidateDetailComponent } from 'src/app/components/station-candidate-detail/station-candidate-detail.component';

@Component({
  selector: 'app-technical-detail',
  templateUrl: './technical-detail.component.html',
  styleUrls: ['./technical-detail.component.css']
})
export class TechnicalDetailComponent implements OnInit {
  loader: boolean = false;
  initialLoader: boolean = false;
  modalClose: boolean = false;
  stationId: any;
  candidateId: any
  serviceScheduledBy:any;
  serviceAssignee: any;
  constructor(private apiService: ApiService, private route: ActivatedRoute, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.initialLoader = true;
    this.route.params.subscribe(params => {
      this.stationId = params['id'];
      this.initialLoader = true;
    });
  }

  onSwitchStation(candidate: any): void {
    this.modalClose = false;
    // console.log("this.stationId:", this.stationId, typeof this.stationId);

    if (candidate?.serviceStatus === 'pending' && ((this.stationId === '2' && candidate?.currentStation === 'Technical 1') || (this.stationId === '3' && candidate?.currentStation === 'Technical 2') || (this.stationId === '4' && candidate?.currentStation === 'Technical 3'))) {
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
      });
    } else {
      const dialogRef = this.dialog.open(WarningBoxComponent, {})
      dialogRef.afterClosed().subscribe(() => {
        this.modalClose = true;
      });
    }
  }

  fetchDetails(details: { id: any, status: any }): void {
    const id = details.id;
    const status = details.status;
    
    if (this.stationId === '2') {
      this.apiService.get(`/written-station/progressDetail?serviceId=${id}`).subscribe((data: any) => {
      
        if (data?.candidates) this.viewCandidateDetail(data?.candidates, status);
        // console.log("data" , data?.candidates['candidate.candidateId']);
        
      });
    } else if (this.stationId === '3') {
      this.apiService.get(`/technical-station/progressDetail?serviceId=${id}`).subscribe((data: any) => {
        if (data?.candidates) this.viewCandidateDetail(data?.candidates, status);
      });
    } else if (this.stationId === '4') {
      this.apiService.get(`/technical-station-two/progressDetail?serviceId=${id}`).subscribe((data: any) => {
        if (data?.candidates) this.viewCandidateDetail(data?.candidates, status);
      });
    }
    localStorage.setItem('currentStationId', this.stationId);
  }

  viewCandidateDetail(item: any, status: any): void {
    // console.log("item",item);
    
    this.modalClose = false;
    const dialogRef = this.dialog.open(StationCandidateDetailComponent, {
      data: { candidateDetails: item, offerStatus: status },
    })
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      this.modalClose = true;
    })
  }

}
