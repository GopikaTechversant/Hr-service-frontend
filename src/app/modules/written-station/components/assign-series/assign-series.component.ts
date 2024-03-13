import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-assign-series',
  templateUrl: './assign-series.component.html',
  styleUrls: ['./assign-series.component.css']
})
export class AssignSeriesComponent implements OnInit {
  showDropdown: boolean = false;
  selectedSeries: string = '';
  seriesList: any[] = [];
 
  constructor(public dialogRef: MatDialogRef<AssignSeriesComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

  }
  ngOnInit(): void {
    this.seriesList = this.data.seriesList;
    console.log("qwert", this.seriesList);
  }
  selectSeries(id: any, name: any): void {
    this.selectedSeries = name;
  }
  cancel(): void {
    this.dialogRef.close();
  }
  save(): void {
    this.dialogRef.close(this.selectedSeries);
  }
}
