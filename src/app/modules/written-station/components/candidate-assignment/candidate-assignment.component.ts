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
  candidates_list: any[] = [];
  searchKeyword: string = '';
  created_Box: any[] = [];
  showQuestions: boolean = false;
  questions_list: any = [];

  constructor(private route: ActivatedRoute, private dialog: MatDialog, private tostr: ToastrServices, private apiService: ApiService, private s3Service: S3Service) {
    this.route.queryParams.subscribe(params => {
      this.requestId = params['requestId'];
    });
  }

  ngOnInit(): void {
    this.fetchCandidates();
    this. fetchCandidatesWithQuestionBox();
  }

  fetchCandidates(): void {
    this.apiService.get(`/screening-station/list-batch/${this.requestId}?station=2&experience=${this.searchKeyword}`).subscribe((res: any) => {
      if (res && res?.candidates) this.candidates_list = res?.candidates;
      // this.showAverageScoreInput = this.candidates_list.some((candidate: any) => candidate.serviceStatus === 'pending');
    });
  }

  fetchCandidatesWithQuestionBox(): void {
    this.apiService.get(`/written-station/questionBatchList/${this.requestId}`).subscribe((res: any) => {
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

  clearFilter(item: any): void {
    if (item === 'search') this.searchKeyword = '';
    this.fetchCandidates();
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
