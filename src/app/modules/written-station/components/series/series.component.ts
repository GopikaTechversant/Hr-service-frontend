import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css'],
})
export class SeriesComponent implements OnInit {
  requestId: any;
  showAverageScoreInput: boolean = false;
  candidates_list: any[] = [];
  selectedFile: File | null = null;
  series_list_showAverageScoreInput: boolean = false;
  created_Box: any[] = [];
  isQuestionBoxCreated: boolean = false;
  showQuestions: boolean = false;
  questions_list: any = [];
  candidatesWithQuestionBox: any[] = [];
  imageUrl: string = '';
  assigned_candidates: any[] = [];
  questionListOpen: boolean = false;
  idListOpen: boolean = false;
  selectedQuestion: any;
  selectedQuestionId: any;
  selectedCandidate: any;
  selectedCandidateIds: any[] = [];
  candidateMarkDetail: any;
  candidatesStatus: any[] = [];
  averageScore: string | null = null;
  selectedBox: any;
  isExperienceListOpen: boolean = false;
  resumePath: any;
  searchKeyword: string = '';

  ngOnInit(): void {
    this.fetchCandidates();
    this.fetchCandidatesWithQuestionBox();
    this.fetchQuestions();
    // this.image();
  }

  constructor(private http: HttpClient, private route: ActivatedRoute, private dialog: MatDialog, private tostr: ToastrServices, private apiService: ApiService, private s3Service: S3Service) {
    this.route.queryParams.subscribe(params => {
      this.requestId = params['requestId'];
    });
  }

  fetchCandidates(): void {
    this.apiService.get(`/screening-station/list-batch/${this.requestId}?station=2&experience=${this.searchKeyword}`).subscribe((res: any) => {
      if (res && res?.candidates) this.candidates_list = res?.candidates;
      this.showAverageScoreInput = this.candidates_list.some((candidate: any) => candidate.serviceStatus === 'pending');
    });
  }

  searchCandidate(searchTerm: string): void {
    this.searchKeyword = searchTerm;
    this.fetchCandidates();
  }

  clearFilter(item: any): void {
    if (item === 'search') this.searchKeyword = '';
    this.fetchCandidates();
  }

  image(): void {
    this.http.get('https://hr-service-images.s3.us-east-2.amazonaws.com/Screenshot+from+2024-04-04+12-16-07.png.png', { responseType: 'blob' })
      .subscribe((response: Blob) => {
        // Convert the blob response to a data URL
        const reader = new FileReader();
        reader.onload = () => {
          this.imageUrl = reader.result as string;
        };
        reader.readAsDataURL(response);
      });
  }

  fetchCandidatesWithQuestionBox(): void {
    this.apiService.get(`/written-station/questionBatchList/${this.requestId}`).subscribe((res: any) => {
      if (res?.data) this.created_Box = res?.data;
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

  createQuestionBox(): void {
    const payload = { requstId: this.requestId }
    const previousBoxIndex = this.created_Box.length - 1;
    const previousBoxContainsQuestions = previousBoxIndex >= 0 && this.created_Box[previousBoxIndex].questionName;
    if (this.candidates_list.length !== 0) {
      if (previousBoxContainsQuestions || this.created_Box.length === 0) {
        this.apiService.post(`/written-station/create-question-box`, payload).subscribe((res: any) => {
          if (res?.data) {
            this.created_Box.push({
              id: res.data.id,
              requstId: res.data.requstId,
              name: `Question Box ${this.created_Box.length + 1}`
            });
            this.isQuestionBoxCreated = true;
          }
        })
      }
    }
  }

  openAssignModal(candidate: any): void {
    if (this.created_Box.length == 0) {
      const dialogRef = this.dialog.open(AssignSeriesComponent, {
        height: '150px',
        width: '350px',
      });
    } else {
      const dialogRef = this.dialog.open(AssignSeriesComponent, {
        height: '265px',
        width: '477px',
        data: { seriesList: this.created_Box, candidateServiceId: candidate }
      });
      dialogRef.afterClosed().subscribe((selectedQuestionBox: any) => {
        if (selectedQuestionBox.series) {
          if (!selectedQuestionBox.series.questionName) {
            // Find the selected question box by name
            this.selectedBox = this.created_Box.find((box: any) => box.name === selectedQuestionBox.series.name);
            if (this.selectedBox) {
              // Check if candidates array already exists for this box
              if (!this.selectedBox.candidates) {
                this.selectedBox.candidates = []; // Initialize candidates array if not exists
              }
              // Check if the candidate is already assigned to this box
              const alreadyAssigned = this.selectedBox.candidates.some((c: any) => c.candidateId === candidate.candidateId);
              if (!alreadyAssigned) {
                // Push the candidate to the candidates array of the selected box
                this.selectedBox.candidates.push(candidate);
                // Remove the candidate from the candidates_list
                this.candidates_list = this.candidates_list.filter((item: any) => item.candidateId !== candidate.candidateId);
                // Remove the candidate from other question boxes if already assigned

                this.created_Box.forEach((s: any) => {
                  if (s.candidates && s !== this.selectedBox) {
                    s.candidates = s.candidates.filter((c: any) => c.candidateId !== candidate.candidateId);
                  }
                });
              } 
            }
          }

          else if (selectedQuestionBox.series.questionName) {
            this.selectedBox = this.created_Box.find((box: any) => box.name === selectedQuestionBox.series.name);
            // if (!this.selectedBox.candidates) {
            //   this.selectedBox.candidates = []; // Initialize candidates array if not exists
            // }
            this.selectedBox.candidates.push(selectedQuestionBox.candidate)
            const requestData = {
              questionBoxId: selectedQuestionBox.series.boxId,
              questionId: selectedQuestionBox.series.questionId,
              questionServiceId: [] as string[]
            };
            requestData.questionServiceId.push(selectedQuestionBox.candidate.serviceId);
            this.apiService.post(`/written-station/assign-question`, requestData).subscribe((res: any) => {
              this.fetchCandidatesWithQuestionBox();
              this.fetchCandidates();
              this.fetchQuestions();
            });
          }
        }
      });
    }
  }

  selectQuestion(questionBox: any, id: any, name: any): void {
    this.questions_list = this.questions_list.filter((question: { questionId: any; }) => question.questionId !== id);
    if (questionBox) {
      this.selectedQuestion = name;
      this.selectedQuestionId = id;
      this.idListOpen = false;
      this.assignQuestion(this.selectedQuestionId, questionBox);
      // this.fetchQuestions();
    }
  }

  assignQuestion(questionId: any, questionBox: any): void {
    const requestData = {
      questionBoxId: questionBox.id,
      questionId: questionId,
      questionServiceId: [] as string[]
    };
    // Get candidate service IDs for the current series
    if (questionBox.candidates && questionBox.candidates.length > 0) {
      questionBox.candidates.forEach((candidate: { serviceId: string }) => {
        if (candidate.serviceId) requestData.questionServiceId.push(candidate.serviceId);
      });
    }
    this.apiService.post(`/written-station/assign-question`, requestData).subscribe((res: any) => {
      this.fetchCandidatesWithQuestionBox();
      this.fetchQuestions();
    });
  }

  onSwitchStation(candidate: any): void {
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
        this.fetchCandidatesWithQuestionBox();
      });
    } else {
      const dialogRef = this.dialog.open(WarningBoxComponent, {})
      dialogRef.afterClosed().subscribe(() => {
        this.fetchCandidates();
        this.fetchCandidatesWithQuestionBox();
      });
    }
  }

  resultClick(candidate: any, id: any): void {
    this.selectedCandidate = candidate;
    this.selectedCandidateIds = id;
    const dialogRef = this.dialog.open(ResultComponent, {
      height: '430px',
      width: '600px',
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
      this.fetchCandidatesWithQuestionBox();
    });

  }

  // viewProgressFile(progressFile: string) {
  //   window.open(`${environment.api_url}${progressFile}`, '_blank');
  // }

  viewResume(resume: any) {
    this.resumePath = resume;
    window.open(`${environment.s3_url}${this.resumePath}`, '_blank');
  }

  approve(): void {
    const ScoreAddedTrue = this.created_Box.some(candidate => candidate.serviceStatus !== 'done' && candidate.progressScore !== null);
    const ScoreAddedFalse = this.created_Box.some(candidate => candidate.serviceStatus !== 'done' && candidate.progressScore == null);
    const averageScoreInput = document.getElementById('averageScore') as HTMLInputElement;
    const averageScore = averageScoreInput.value;
    const payload = {
      serviceId: this.requestId,
      averageScore: averageScore
    };
    if (ScoreAddedTrue) {
      this.apiService.post(`/written-station/approve`, payload).subscribe({
        next: (res: any) => {
          this.tostr.success('Approved');
          this.averageScore = averageScore;
          this.fetchCandidatesWithQuestionBox();
        },
        error: (error) => {
          if (error?.status === 500) this.tostr.error("Internal Server Error");
          else this.tostr.warning("Rejected due to a below-average score");
        }
      })
    } else if (ScoreAddedFalse) this.tostr.warning('Please add score');
  }

  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
    fileInput.click();
  }

}
