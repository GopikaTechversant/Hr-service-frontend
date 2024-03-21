import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environments';
import { MatDialog } from '@angular/material/dialog';
import { CandidateDetailModalComponent } from '../candidate-detail-modal/candidate-detail-modal.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-technical-detail',
  templateUrl: './technical-detail.component.html',
  styleUrls: ['./technical-detail.component.css']
})
export class TechnicalDetailComponent implements OnInit {
  @Output() itemSelected = new EventEmitter<any>();
  candidateList: any = [];
  loader: boolean = false;
  selectedItem: any;
  stationId: any;
  filterStatus: boolean = false;
  selectStatus: boolean = false;
  Status: any = [{ status: 'active' },
  { status: 'pending' },
  { status: 'done' }
  ]
  filteredStatus: string = 'Filter Candidate by Status';
  candidateStatus: string = 'Choose Candidate Status';
  constructor(private apiService: ApiService, private route: ActivatedRoute, private dialog: MatDialog) {
    // this.route.params.subscribe(params => {
    //   this.stationId = params['id'];
    // });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.stationId = params['id'];
      this.candidateList = [];
      this.fetchList(); 
    });
  }

  fetchList(): void {
    this.loader = true;    
    if(this.stationId === '3'){
      this.apiService.get(`/technical-station/list`).subscribe((data: any) => {
        this.loader = false;
        if (data?.candidates) {
          this.candidateList.push(data.candidates);
        }
      });
    }else if(this.stationId === '4'){
      this.apiService.get(`/technical-station-two/list`).subscribe((data: any) => {
        this.loader = false;
        if (data?.candidates) {
          this.candidateList.push(data.candidates);
        }
      });
    }  
  }

  fetchDetails(id: any , status :any) : void {
    if(this.stationId === '3'){
    this.apiService.get(`/technical-station/progressDetail?serviceId=${id}`).subscribe((data: any) => {
      if (data?.candidates) this.viewCandidateDetail(data?.candidates , status); 
    });
  }else  if(this.stationId === '4'){
    this.apiService.get(`/technical-station-two/progressDetail?serviceId=${id}`).subscribe((data: any) => {
      if (data?.candidates) this.viewCandidateDetail(data?.candidates , status); 
    });
  }
  }

  selectStatusFilter(item: string): void {
    this.filteredStatus = item
  }

  statusClick(candidate: any, status: string, event: Event): void {
    candidate.selectedStatus = status;
    candidate.selectStatus = false; 
    event.stopPropagation(); 
  }
  
  toggleDropdown(candidate: any, event: Event): void {
    candidate.selectStatus = !candidate.selectStatus;
    event.stopPropagation(); 
  }

  viewCandidateDetail(item: any , status :any): void {
    const dialogRef = this.dialog.open(CandidateDetailModalComponent, {
      data: { candidateId: item['candidate.candidateId'], stationId: this.stationId, candidateDetails: item , progressStatus: status},
      width: '600px',
      height: '300px'
    })
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      console.log('Modal closed, refreshing list.');

      this.candidateList = [];
       this.fetchList();
    })
  }

}
