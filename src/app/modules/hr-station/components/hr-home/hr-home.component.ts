import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-hr-home',
  templateUrl: './hr-home.component.html',
  styleUrls: ['./hr-home.component.css']
})
export class HrHomeComponent implements OnInit {
  @Output() itemSelected = new EventEmitter<any>();
  candidateList: any = [];
  loader: boolean = false;
  selectedItem: any;
  selectedCandidatesIds: any;
  candidateServiceId: any;
  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog) {

  }
  ngOnInit(): void {
    this.fetchList();
  }
  fetchList() {
    this.http.get(`${environment.api_url}/hr-station/list`).subscribe((data: any) => {
      this.loader = false;
      if (data.candidates) {
        this.candidateList.push(data.candidates);
        this.selectedItem = this.candidateList[0][0];
        this.itemSelected.emit(this.selectedItem);
      }
    })
  }
  onSelect(item: any): void {
    this.selectedItem = item;
    this.itemSelected.emit(this.selectedItem);
  }
  navigateToDetail(id: any): void {
    this.router.navigate(['/detail'], {
    });
  }

}
