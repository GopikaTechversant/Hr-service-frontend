import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { ActivatedRoute } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ResultComponent } from '../result/result.component';
import { AssignSeriesComponent } from '../assign-series/assign-series.component';
import { ToastrServices } from 'src/app/services/toastr.service';
@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css'],
  animations: [
    trigger('toggleAnimation', [
      state('visible', style({ width: '25%' })),
      state('hidden', style({ width: '0', transform: 'translateX(100%)' })),
      transition('visible => hidden', animate('.9s ease-out')),
      transition('hidden => visible', animate('.5s ease-in-out')),
    ]),
  ],
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
  list: any[] = [
    {
      name: 'John',
      designation: 'Software Engineer',
      team: 'Coldfusion',
      skills: 'Python',
      email: 'john@gmail.com'
    },
    {
      name: 'Akash',
      designation: 'Software Engineer',
      team: 'Coldfusion',
      skills: 'Python',
      email: 'john@gmail.com'
    },
    {
      name: 'Devika',
      designation: 'Software Engineer',
      team: 'Coldfusion',
      skills: 'Python',
      email: 'john@gmail.com'
    },
    {
      name: 'Malu',
      designation: 'Software Engineer',
      team: 'Coldfusion',
      skills: 'Python',
      email: 'john@gmail.com'
    },
  ];
  constructor(private http: HttpClient, private route: ActivatedRoute, private dialog: MatDialog, private tostr: ToastrServices) {
    this.route.queryParams.subscribe(params => {
      this.requestId = params['requestId'];
    });
  }

  ngOnInit(): void {
    this.fetchCandidates();
    this.fetchCandidatesWithSeriess();
    this.fetchQuestions();
    this.refreshed = true;
    this.newSeriesCreated = false;
  }

  fetchCandidates(): void {
    this.http.get(`${environment.api_url}/screening-station/list-batch/${this.requestId}?station=2`).subscribe((res: any) => {
      this.candidates_list = res.candidates;
      console.log(" this.candidates_list ", this.candidates_list);

      this.candidates_list.forEach((candidate: any) => {
        if (candidate.serviceId) {
          this.serviceIds.push(candidate.serviceId);

        }
      });
    });
  }


  fetchQuestions(): void {
    this.http.get(`${environment.api_url}/written-station/questions`).subscribe((data: any) => {
      this.questions_list = data.data.filter((question: any) => !this.assignedQuestionIds.includes(question.questionId));
    });
  }

  fetchCandidatesWithSeries(): void {
    this.http.get(`${environment.api_url}/screening-station/list-batch/${this.requestId}?station=2`).subscribe((res => {
    }))
  }


  fetchCandidatesWithSeriess(): void {
    this.http.get(`${environment.api_url}/written-station/questionBatchList/${this.requestId}`).subscribe((res: any) => {
      this.series_list = res.data;
      console.log(" this.series_list", this.series_list);

      res?.data.forEach((data: any) => {
        this.assignedQuestionIds.push(data.questionId);
        this.assignedQuestionsName.push({
          id: data.questionId,
          name: data.questionName
        });
      })
      this.newSeriesCreated = false;

    });
  }

  seriesBoxClick(series: any) {
    this.series_list.forEach((s: any) => s.active = false);
    series.active = true;
    this.activeSeries = series;
    this.activeDropdownSeries = series;
    console.log(" this.series_list", this.activeSeries);

  }

  allowDrop(ev: any) {
    ev.preventDefault();
  }


  onDrop(event: any) {
    this.selectedCandidate = event.itemquestionId.data;
  }

  moved(event: any) {
    this.pointerPosition = event.pointerPosition;
  }

  itemDropped(event: any, series: any) {

  }

  createSeries(): void {
    this.refreshed = true;
    this.newSeriesCreated = true;
    const newSeriesName = `Series${this.series_list.length + 1}`;
    const newSeries = { name: newSeriesName, questions: [] };
    this.series_list.push(newSeries);
    this.activeSeries = newSeries;
    this.activeDropdownSeries = newSeries;
    this.fetchCandidatesWithSeries();
  }

  dragStart(event: any, candidate: any) {
    if (!candidate.progressId) {
      event.dataTransfer.setData('text/plain', JSON.stringify(candidate));
    } else {
      event.preventDefault();
    }
  }


  dragOver(event: DragEvent) {
    event.preventDefault();
  }

  productDrop(event: any, series: any) {
    event.preventDefault();
    const candidateData = event.dataTransfer.getData('text/plain');
    const candidate = JSON.parse(candidateData);
    this.series_list.forEach((s: any) => {
      if (s?.candidates) {
        s.candidates = s.candidates.filter((c: any) => c?.candidateId !== candidate?.candidateId);
      }
    });
    // Remove the candidate from the candidates_list
    this.candidates_list = this.candidates_list.filter((c: any) => c?.candidateId !== candidate?.candidateId);
    // Add the dropped candidate to the candidates array of the new series
    if (!candidate.progressId) {
      series.candidates = series.candidates || [];
      series.candidates.push(candidate);
    }
    // Create a new array with only serviceId values for each series
    this.payload_series_list = this.series_list.map((s: any) => {
      this.serviceId = s.candidates.map((c: any) => c?.serviceId);
      if (s.candidates) {
        let array = s.questions
        return {
          questions: s.questions,
        };
      }
      return s;
    });
    this.series_list = [...this.series_list];
    event.preventDefault();
    event.stopPropagation();
  }

  dragOverSeries(event: DragEvent, series: any) {
    event.preventDefault();
    this.dragEnteredSeries = series;
  }

  approve(): void {
    const averageScoreInput = document.getElementById('averageScore') as HTMLInputElement;
    const averageScore = averageScoreInput.value;
    const payload = {
      serviceId: this.requestId,
      averageScore: averageScore
    };
    this.http.post(`${environment.api_url}/written-station/approve`, payload).subscribe((res: any) => {
      alert("approved");
    })
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
      this.fetchCandidatesWithSeriess();
    });
  }

  toggleTaskDetails() {
    this.isTaskDetailsOpen = !this.isTaskDetailsOpen;
    this.activeDropdownSeries = null;
  }

  selectQuestion(id: any, name: any): void {
    if (this.activeSeries && this.selectedQuestionId !== id) {
      this.selectedQuestionId = id;
      this.selectedQuestionName = name;
      this.selectedQuestions[this.activeSeries.name] = { id, name };
      this.activeSeries.questions = [name];
      this.activeDropdownSeries = null;
    }
  }


  isQuestionSelected(series: any, question: any): void {
    this.selectedQuestions[series.name]?.id === question.questionId;
    this.questionSelected = true;
  }

  assignQuestion(): void {
    const requestData = {
      questionAssignee: null,
      questionId: this.selectedQuestionId,
      questionServiceId: this.serviceId
    }
    this.http.post(`${environment.api_url}/written-station/assign-question`, requestData).subscribe((res: any) => {
      this.questionAssigned = true;
      this.fetchCandidatesWithSeriess();
      const index = this.questions_list.findIndex((question: any) => question.questionId === this.selectedQuestionId);
      if (index !== -1) {
        this.questions_list.splice(index, 1);
        this.questions_list = [...this.questions_list];
      }
    }
    )
  }
  openAssignModal() {
    if (this.series_list.length <= 0) {
      this.tostr.warning('You have not created series to assign');
    } else {
      const dialogRef = this.dialog.open(AssignSeriesComponent, {
        height: '265px',
        width: '477px',
      })
    }
  }
}
