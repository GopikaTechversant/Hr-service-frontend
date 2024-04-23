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
  SelectedStation: string ='';
  stationId: any;
  currentStation: any;
  constructor(public dialogRef: MatDialogRef<StationSwitchComponent>, @Inject(MAT_DIALOG_DATA)
  public data: any,
    private apiService: ApiService, private tostr: ToastrServices) {
      if (data) {
        console.log(data);
        
        this.candidateDetails = data;
        this.currentStation = data?.currentStation
      }
      this.dialogRef.updateSize('35%', '50%')
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
      this.stationsList = res?.data.slice(1);
      console.log(this.stationsList , "1st");
      
      this.stationsList = this.stationsList.filter((station: any) => station.stationName !== this.currentStation.stationName);
      console.log(this.stationsList , "filter");
      
    });
  }

  selectStation(station: string , id : any): void {
    this.SelectedStation = station;
    this.stationId = id;
  }


  closeDialog(): void {
    this.dialogRef.close();
  }

}
