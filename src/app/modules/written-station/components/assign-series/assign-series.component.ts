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
  series: any[] = [];
  candidate:any;
  constructor(public dialogRef: MatDialogRef<AssignSeriesComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.seriesList = this.data?.seriesList;
    this.candidate = this.data?.candidateServiceId;
    console.log("this.seriesList",this.seriesList);
  }

  selectSeries(id: any, name: any,series:any): void {
    this.selectedSeries = name;    
    this.series = series;

  }
  
  cancel(): void {
    this.dialogRef.close();
  }
  
  save(): void {
    this.dialogRef.close({ series: this.series, candidate: this.candidate });
  }
}
