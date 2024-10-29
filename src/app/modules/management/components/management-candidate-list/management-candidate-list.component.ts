import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { StationSwitchComponent } from 'src/app/components/station-switch/station-switch.component';
import { WarningBoxComponent } from 'src/app/components/warning-box/warning-box.component';
import { DatePipe } from '@angular/common';
import { StationCandidateDetailComponent } from 'src/app/components/station-candidate-detail/station-candidate-detail.component';
@Component({
  selector: 'app-management-candidate-list',
  templateUrl: './management-candidate-list.component.html',
  styleUrls: ['./management-candidate-list.component.css']
})
export class ManagementCandidateListComponent implements OnInit {
  loader: boolean = false;
  initialLoader: boolean = false;
  modalClose: boolean = false;

  constructor(private apiService: ApiService, private dialog: MatDialog, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.initialLoader = true;
  }

  onSwitchStation(candidate: any): void {
    this.modalClose = false;
    if (candidate?.serviceStatus === 'pending') {
      const userId = localStorage.getItem('userId');
      const dialogRef = this.dialog.open(StationSwitchComponent, {
        data: {
          userId: userId,
          name: candidate['candidate.candidateFirstName'] + ' ' + candidate['candidate.candidateLastName'],
          serviceId: candidate?.serviceId,
          currentStation: 'management',
          currentStationId: '6',
          requirement: candidate['serviceRequest.requestName']
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
    this.modalClose = false;
    const id = details.id;
    const status = details.status;
    this.apiService.get(`/management-station/progressDetail?serviceId=${id}`).subscribe((data: any) => {
      if (data?.candidates) this.viewCandidateDetail(data?.candidates, status);
    });
  }

  viewCandidateDetail(item: any, status: any): void {
    const dialogRef = this.dialog.open(StationCandidateDetailComponent, {
      data: { candidateDetails: item, offerStatus: status },
    })
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      this.modalClose = true;
    })
  }
}
