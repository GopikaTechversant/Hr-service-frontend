import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { ActivatedRoute } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ResultComponent } from '../result/result.component';
import { AssignSeriesComponent } from '../assign-series/assign-series.component';
import { ToastrServices } from 'src/app/services/toastr.service';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css'],
})
export class SeriesComponent implements OnInit {
  series_list: any = [];
  activeSeries: any;
  candidates_list: any;
  selectedCandidate: any;
  pointerPosition: any;
  dragEnteredSeries: any;
  candidates: any = [];
  biggieMoveSelected: boolean = false;
  activeBucket: any;
  requestId: any;
  isTaskDetailsOpen: boolean = false;
  serviceIds: any = [];
  questions_list: any = [];
  idListOpen: boolean = false;
  selectedQuestionId: any;
  selectedQuestionName: any;
  activeDropdownSeries: any = null;
  selectedQuestions: { [key: string]: { id: any, name: any } } = {};
  requestData: any = [];
  serviceId: any = [];
  payload_series_list: any = [];
  score: number = 0;
  candidates_score: any = [];
  questionSelected: boolean = false;
  selectedCandidateIds: any[] = [];
  resultadded: any[] = [];
  selectedCandidateId: any;
  refreshed: boolean = false;
  assignedQuestionIds: any[] = [];
  assignedQuestionsName: any[] = [];
  newSeriesCreated: boolean = false;
  oldseries: boolean = false;
  candidateMarkDetail: any;
  questionAssigned: boolean = false;
  droppedAllowed: boolean = false;
  selectedQuestion: any;
  candidatesStatus: any[] = [];
  // approvedCandidates:boolean=false;
  showAverageScoreInput: boolean = false;
  constructor(private http: HttpClient, private route: ActivatedRoute, private dialog: MatDialog, private tostr: ToastrServices, private apiService: ApiService) {
    this.route.queryParams.subscribe(params => {
      this.requestId = params['requestId'];
    });
  }
  ngOnInit(): void {
    this.fetchCandidates();
    this.fetchCandidatesWithSeries();
    this.fetchQuestions();
    this.refreshed = true;
    this.newSeriesCreated = false;
  }
  fetchCandidates(): void {
    this.apiService.get(`/screening-station/list-batch/${this.requestId}?station=2`).subscribe((res: any) => {
      if (res?.candidates) this.candidates_list = res?.candidates;
      console.log(" this.candidates_list ", this.candidates_list);
      this.showAverageScoreInput = this.candidates_list.some((candidate: any) => candidate.serviceStatus === 'pending');
      // this.candidates_list.forEach((candidate: any) => {
      //   if (candidate.serviceId) this.serviceIds.push(candidate.serviceId);
      // });
    });
  }
  fetchQuestions(): void {
    this.apiService.get(`/written-station/questions`).subscribe((data: any) => {
      this.questions_list = data.data.filter((question: any) => !this.assignedQuestionIds.includes(question.questionId));
    });
  }
  // fetchCandidatesWithSeries(): void {
  //   this.apiService.get(`/screening-station/list-batch/${this.requestId}?station=2`).subscribe((res => {
  //   }))
  // }
  fetchCandidatesWithSeries(): void {
    this.apiService.get(`/written-station/questionBatchList/${this.requestId}`).subscribe((res: any) => {
      this.candidatesStatus = res?.data;
      this.candidatesStatus.forEach((data: any) => {
        console.log("data", data);

      })
      if (res.result && res.data) {
        this.series_list = res.data.map((item: { questionId: any; questionName: any; candidates: any; }, index: number) => ({
          name: `Series ${index + 1}`,
          active: false,
          questionId: item.questionId,
          questionName: item.questionName,
          showQuestions: false,
          selectedQuestion: null,
          candidates: item.candidates
        }));
        console.log("this.series_list", this.series_list);
      } else {
        console.error('Failed to fetch series data:', res.message);

      }
    }, error => {
      console.error('Error fetching series data:', error);

    });


  }

  seriesBoxClick(series: any) {
    this.series_list.forEach((s: any) => s.active = false);
    series.active = true;
    this.activeSeries = series;
    this.activeDropdownSeries = series;
    console.log(" this.series_list", this.series_list);
  }

  createSeries() {
    const newSeries = {
      name: `Question Box ${this.series_list.length + 1}`,
      active: false,
      questionId: null,
      showQuestions: false,
      selectedQuestion: null
    };
    this.series_list.push(newSeries);
    this.newSeriesCreated = true;
  }


  approve(): void {
    const isScoreAdded = this.candidatesStatus.some(candidate => candidate.serviceStatus !== 'done' && candidate.progressScore !== null);
    const demo = this.candidatesStatus.some(candidate => candidate.serviceStatus !== 'done' && candidate.progressScore == null);
    const averageScoreInput = document.getElementById('averageScore') as HTMLInputElement;
    const averageScore = averageScoreInput.value;
    const payload = {
      serviceId: this.requestId,
      averageScore: averageScore
    };
    if(isScoreAdded){
      this.apiService.post(`/written-station/approve`, payload).subscribe((res: any) => {
        this.tostr.success('Approved');
      })
    }else if(demo) this.tostr.warning('Please add score');
    else this.tostr.warning('already moved to next round')
   
  }
  resultClick(candidate: any, id: any): void {
    this.selectedCandidate = candidate;
    this.selectedCandidateIds = id;
    const dialogRef = this.dialog.open(ResultComponent, {
      data: {
        candidateIds: this.selectedCandidateIds,
        candidate: this.selectedCandidate
      }
    }
    );
    dialogRef.componentInstance.scoreSubmitted.subscribe((score: number) => {
      this.selectedCandidate.examScore = score;
      this.candidateMarkDetail = {
        candidateIds: this.selectedCandidateIds,
        candidate: this.selectedCandidate,
        score: this.selectedCandidate.examScore
      }
      this.fetchCandidatesWithSeries();
    });
  }

  toggleTaskDetails() {
    this.isTaskDetailsOpen = !this.isTaskDetailsOpen;
    this.activeDropdownSeries = null;
  }


  selectQuestion(questionId: string, questionName: string, series: any): void {
    this.selectedQuestion = questionName;
    this.questions_list = this.questions_list.filter((question: { questionId: any; }) => question.questionId !== questionId);
    this.selectedQuestionId = questionId;
    this.assignQuestion(questionId, series);
  }

  isQuestionSelected(series: any, question: any): void {
    this.selectedQuestions[series.name]?.id === question.questionId;
    this.questionSelected = true;
  }


  assignQuestion(questionId: string, series: any): void {
    const requestData = {
      questionAssignee: null,
      questionId: questionId,
      questionServiceId: [] as string[]
    };
    // Get candidate service IDs for the current series
    if (series.candidates && series.candidates.length > 0) {
      series.candidates.forEach((candidate: { serviceId: string }) => {
        if (candidate.serviceId) requestData.questionServiceId.push(candidate.serviceId);
      });
    }
    this.apiService.post(`/written-station/assign-question`, requestData).subscribe((res: any) => {
      this.questionAssigned = true;
      // Remove assigned question from the available questions list
      const index = this.questions_list.findIndex((question: any) => question.questionId === questionId);
      if (index !== -1) {
        this.questions_list.splice(index, 1);
        this.questions_list = [...this.questions_list];
      }
    });
  }

  openAssignModal(candidate: any, series: any) {
    if (this.series_list?.length == 0) {
      const dialogRef = this.dialog.open(AssignSeriesComponent, {
        height: '150px',
        width: '300px',
      })
    } else {
      const dialogRef = this.dialog.open(AssignSeriesComponent, {
        height: '265px',
        width: '477px',
        data: { seriesList: this.series_list, candidateServiceId: candidate?.serviceId }
      });
      dialogRef.afterClosed().subscribe((selectedSeries: string) => {
        if (selectedSeries) {
          const selectedSeriesObj = this.series_list.find((s: any) => s.name === selectedSeries || s.questionName === selectedSeries)
          if (selectedSeriesObj) {
            // remove the candidate from the candidate list
            this.candidates_list = this.candidates_list.filter((c: any) => c.candidateId !== candidate.candidateId);
            // remove the candidate from the previous series candidate array
            this.series_list.forEach((s: any) => {
              if (s.candidates && s !== selectedSeriesObj) {
                s.candidates = s.candidates.filter((c: any) => c.candidateId !== candidate.candidateId);
              }
            });
            //add the candidates to the selected series 
            if (!candidate.progressId || this.questionAssigned) {
              selectedSeriesObj.candidates = selectedSeriesObj.candidates || [];
              selectedSeriesObj.candidates.push(candidate);
            }
            this.payload_series_list = this.series_list.map((s: any) => {
              if (s && s.candidates) {
                this.serviceId = s.candidates.map((c: any) => c?.serviceId);
                return { questions: s.questions };
              }
              return s;
            });

            this.series_list = [...this.series_list];
            console.log("this.series_list", this.series_list);
            console.log("selectedSeriesObj", selectedSeriesObj);
            if (selectedSeriesObj.questionName) this.assignQuestion(selectedSeriesObj.questionId, selectedSeriesObj)
          } else this.tostr.warning('There is no selected series');
        }
      })
    }
  }
  allCandidatesHaveScores(): boolean {
    return this.candidates_list?.every((candidate: any) => candidate.serviceStatus !== 'done');
  }
}
