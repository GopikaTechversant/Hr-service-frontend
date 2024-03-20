import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    this.route.params.subscribe(params => {
      this.stationId = params['id'];
    });
  }

  ngOnInit(): void {
    this.fetchList();
  }

  fetchList(): void {
    this.loader = true;
    this.apiService.get(`/technical-station/list`).subscribe((data: any) => {
      this.loader = false;
      if (data.candidates) {
        this.candidateList.push(data.candidates);
        this.candidateList.forEach((candidate: { selectStatus: boolean; }) => {
          candidate.selectStatus = false;
        });
      }
    });
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

  viewCandidateDetail(item: any): void {
    const dialogRef = this.dialog.open(CandidateDetailModalComponent, {
      data: { candidateId: item['candidate.candidateId'], stationId: this.stationId, candidateDetails: item },
      width: '600px',
      height: '300px'
    })
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
       this.fetchList();
      }
    })
  }
}
