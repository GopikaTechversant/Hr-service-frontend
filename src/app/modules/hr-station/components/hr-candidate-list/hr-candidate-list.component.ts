import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  constructor(private dialog: MatDialog, private apiService: ApiService) { }
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

  fetchDetails(id: any, status: any): void {
    this.apiService.get(`/hr-station/candidateDetail?serviceId=${id}`).subscribe((data: any) => {
      if (data?.candidates) this.viewCandidateDetail(data?.candidates, status);
    });

  }


  viewCandidateDetail(item: any, status: any): void {
    const dialogRef = this.dialog.open(HrCandidateDetailComponent, {
      data: { candidateId: item['candidate.candidateId'], candidateDetails: item, offerStatus: status },
      width: '600px',
      height: '300px'
    })
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
      }

    })
  }

}
