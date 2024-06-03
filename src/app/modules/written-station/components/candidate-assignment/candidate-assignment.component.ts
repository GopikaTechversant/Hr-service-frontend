import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ResultComponent } from '../result/result.component';
import { AssignSeriesComponent } from '../assign-series/assign-series.component';
import { ToastrServices } from 'src/app/services/toastr.service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environments';
import { StationSwitchComponent } from 'src/app/components/station-switch/station-switch.component';
import { WarningBoxComponent } from 'src/app/components/warning-box/warning-box.component';
import { S3Service } from 'src/app/services/s3.service';
@Component({
  selector: 'app-candidate-assignment',
  templateUrl: './candidate-assignment.component.html',
  styleUrls: ['./candidate-assignment.component.css']
})
export class CandidateAssignmentComponent implements OnInit {
  requestId: any;
  candidateList: any[] = [];
  searchKeyword: string = '';
  created_Box: any[] = [];
  showQuestions: boolean = false;
  questions_list: any = [];
  initialLoader:boolean = false
  loader: boolean = true;
  filterStatus: boolean = false;
  filteredStatus: any = '';
  displayPosition: string = '';
  positionId: any;
  requestList: any;
  Status: any = [
    { status: 'pending' },
    { status: 'rejected' },
    { status: 'done' },
    { status: 'moved' }
  ]
  requestList_open: any;
  constructor(private route: ActivatedRoute, private dialog: MatDialog, private tostr: ToastrServices, private apiService: ApiService, private s3Service: S3Service) {
    this.route.queryParams.subscribe(params => {
      this.requestId = params['requestId'];
    });
  }

  ngOnInit(): void {
    this.initialLoader = true;
    this.fetchCandidates();
    this. fetchCandidatesWithQuestionBox();
  }

  fetchCandidates(): void {
    if(!this.initialLoader) this.loader = true;
    this.apiService.get(`/screening-station/list-batch/${this.requestId}?station=2&experience=${this.searchKeyword}`).subscribe((res: any) => {
      this.initialLoader = false;
      this.loader = false;
      if (res && res?.candidates) this.candidateList = res?.candidates;
      // this.showAverageScoreInput = this.candidates_list.some((candidate: any) => candidate.serviceStatus === 'pending');
    });
  }

  fetchCandidatesWithQuestionBox(): void {
    if(!this.initialLoader) this.loader = true;
    this.apiService.get(`/written-station/questionBatchList/${this.requestId}`).subscribe((res: any) => {
      this.initialLoader = false;
      this.loader = false;
      if (res?.data) this.created_Box = res?.data;
      // console.log("this.candidatesWithQuestionBox", this.candidatesWithQuestionBox);
      this.fetchQuestions();
    })
  }

  fetchQuestions(): void {
    this.showQuestions = true;
    this.apiService.get(`/written-station/questions`).subscribe((data: any) => {
      this.questions_list = data?.data;
      if (this.created_Box) {
        this.created_Box.forEach((data: any) => {
          this.questions_list = this.questions_list.filter((question: { questionId: any; }) => question.questionId !== data.questionId);
        })
      }
    });
  }

  searchCandidate(searchTerm: string): void {
    console.log("searchTerm", searchTerm);
    this.searchKeyword = searchTerm;
    this.fetchCandidates();
  }
  
  selectStatusFilter(item: string): void {
    this.filteredStatus = item;
    sessionStorage.setItem('status', this.filteredStatus);
    // this.currentPage = 1;
    // this.limit = 10;
    this.fetchCandidates();
    this.fetchCandidatesWithQuestionBox();
  }

  clearFilter(item: any): void {
    if (item === 'status') {
      this.filteredStatus = '';
      sessionStorage.setItem('status', this.filteredStatus);
    }
    if (item === 'position') {
      this.displayPosition = '';
      this.positionId = '';
      sessionStorage.setItem(`requirement`, JSON.stringify({ name: this.displayPosition, id: this.positionId }));
    }
    if (item === 'search') this.searchKeyword = '';
    // this.currentPage = 1;
    // this.limit = 10;
    this.fetchCandidates();
    this.fetchCandidatesWithQuestionBox();
  }
  // clearFilter(item: any): void {
  //   if (item === 'search') this.searchKeyword = '';
  //   this.fetchCandidates();
  // }

  selectPosition(name: string, id: string): void {
    this.requestList_open = false;
    this.displayPosition = name;
    this.positionId = id;
    sessionStorage.setItem(`requirement`, JSON.stringify({ name: this.displayPosition, id: this.positionId }));
    this.fetchCandidates();
    this.fetchCandidatesWithQuestionBox();
  }

  onSwitchStation(candidate: any): void {
    console.log("candidate", candidate)
    if (candidate?.serviceStatus === 'pending' || candidate?.serviceStatus === 'rejected') {
      const userId = localStorage.getItem('userId');
      const dialogRef = this.dialog.open(StationSwitchComponent, {
        data: {
          userId: userId,
          name: candidate['candidate.candidateFirstName'] + ' ' + candidate['candidate.candidateLastName'],
          serviceId: candidate?.serviceId,
          currentStation: 'Written',
          currentStationId: '2',
          requirement: candidate['reqServiceRequest.requestName']
        },
        width: '700px',
        height: '500px'
      })
      dialogRef.afterClosed().subscribe(() => {
        this.fetchCandidates();
        // this.fetchCandidatesWithQuestionBox();
      });
    } else {
      const dialogRef = this.dialog.open(WarningBoxComponent, {})
      dialogRef.afterClosed().subscribe(() => {
        this.fetchCandidates();
        // this.fetchCandidatesWithQuestionBox();
      });
    }
  }
}
