import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';
import { HrCandidateDetailComponent } from '../hr-candidate-detail/hr-candidate-detail.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-hr-candidate-list',
  templateUrl: './hr-candidate-list.component.html',
  styleUrls: ['./hr-candidate-list.component.css']
})
export class HrCandidateListComponent implements OnInit {
  @Output() itemSelected = new EventEmitter<any>();
  candidateList: any = [];
  loader: boolean = false;
  selectedItem: any = [];
  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog, private apiService: ApiService) { }
  ngOnInit(): void {
    this.fetchList();
  }

  fetchList() {
    this.apiService.get(`/hr-station/list`).subscribe((data: any) => {
      this.loader = false;
      if (data.candidates) {
        this.candidateList.push(data.candidates);
        this.selectedItem = this.candidateList[0][0];
        this.itemSelected.emit(this.selectedItem);
      }
    })
  }

  viewCandidateDetail(item: any): void {
    const dialogRef = this.dialog.open(HrCandidateDetailComponent, {
      data: { candidateId: item['candidate.candidateId'], candidateDetails: item },
      width: '600px',
      height: '300px'
    })
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
      }

    })
  }

}
