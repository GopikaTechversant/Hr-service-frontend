import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-assign-series',
  templateUrl: './assign-series.component.html',
  styleUrls: ['./assign-series.component.css']
})
export class AssignSeriesComponent implements OnInit {
  showDropdown: boolean = false;
  selectedSeries: string = '';
  seriesList: any[] = [
    // {
    //   name: 'Series1',
    //   id: 1
    // },
    // {
    //   name: 'Series2',
    //   id: 2
    // },
    // {
    //   name: 'Series3',
    //   id: 3
    // },
  ]
  constructor(public dialogRef: MatDialogRef<AssignSeriesComponent>) {

  }
  ngOnInit(): void {

  }
  selectSeries(id: any, name: any): void {
    this.selectedSeries = name;
  }
  cancel(): void {
    this.dialogRef.close();
  }
  save(): void {
    this.dialogRef.close();
  }
}
