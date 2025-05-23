import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { ToastrServices } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-station-switch',
  templateUrl: './station-switch.component.html',
  styleUrls: ['./station-switch.component.css'],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
})
export class StationSwitchComponent implements OnInit {
  candidateDetails: any;
  stationsList: any;
  showStations: boolean = false;
  SelectedStation: string = '';
  stationId: any;
  currentStation: any;
  today: Date = new Date();
  loader: boolean = false;
  constructor(public dialogRef: MatDialogRef<StationSwitchComponent>, @Inject(MAT_DIALOG_DATA)
  public data: any,
    private apiService: ApiService, private tostr: ToastrServices) {
    if (data) this.data = data
    this.dialogRef.updateSize('45vw', '55vh')
  }
  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.showStations = false;
    }
  }

  ngOnInit(): void {
    this.fetchStations();
  }

  fetchStations(): void {
    this.apiService.get(`/user/stations`).subscribe((res: any) => {
      this.stationsList = res?.data.slice(1).filter((station: any) => station?.stationId.toString() !== this.data?.currentStationId);
    });
  }

  selectStation(station: string, id: any): void {
    this.SelectedStation = station;
    this.stationId = id;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  submitClick(): void {
    // this.loader = true;
    const commentElement = document.getElementById('comment') as HTMLInputElement;
    if (commentElement?.value.trim() !== '') {
      this.loader = true;
      // console.log("this.data",this.data);
      
      let payload = {
        serviceId: this.data?.serviceId,
        stationId: this.stationId,
        assigneeId: this.data?.assignee,
        date: this.today,
        currentStation: this.data?.currentStationId,
        comment: commentElement?.value,
        movedBy: this.data?.userId
      }
      // console.log("payload",payload);
      
      this.apiService.post(`/user/station-switch`, payload).subscribe({
        next: (res: any) => {
          this.loader = false;
          this.closeDialog();
        },
        error: (error) => {
          this.loader = false;
          this.tostr.error('Error Moving Candidate');
          this.closeDialog();
        }
      });
    } else this.tostr.warning('Please add a comment');
  }
}


