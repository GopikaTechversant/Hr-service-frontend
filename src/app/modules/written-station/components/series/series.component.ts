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
    this.apiService.get(`/screening-station/list-batch/${this.requestId}?station=2`).subscribe((res: any) => {
      if (res && res?.candidates) this.candidates_list = res?.candidates;
      this.showAverageScoreInput = this.candidates_list.some((candidate: any) => candidate.serviceStatus === 'pending');
    });
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
      if (res?.data) this.candidatesWithQuestionBox = res?.data;
      console.log("this.candidatesWithQuestionBox", this.candidatesWithQuestionBox);
    })
  }

  fetchQuestions(): void {
    this.showQuestions = true;
    this.apiService.get(`/written-station/questions`).subscribe((data: any) => {
      this.questions_list = data?.data;
      console.log("data qns", this.questions_list);
    });
  }

  createQuestionBox(): void {
    const payload = { requstId: this.requestId }
    this.apiService.post(`/written-station/create-question-box`, payload).subscribe((res: any) => {
      if (res?.data) {
        this.created_Box.push({
          id: res.data.id,
          requstId: res.data.requstId,
          name: `Question Box ${this.created_Box.length + 1}`
        });
        this.isQuestionBoxCreated = true;
      }
      console.log("created_Box.length", this.created_Box);
    })
  }

  openAssignModal(candidate: any): void {
    console.log("candidate", candidate);
    if (this.created_Box.length == 0) {
      const dialogRef = this.dialog.open(AssignSeriesComponent, {
        height: '150px',
        width: '350px',
      });
    } else {
      const dialogRef = this.dialog.open(AssignSeriesComponent, {
        height: '265px',
        width: '477px',
        data: { seriesList: this.created_Box, candidateServiceId: candidate?.serviceId }
      });
      dialogRef.afterClosed().subscribe((selectedQuestionBox: any) => {
        if (selectedQuestionBox) {
          console.log("selectedQuestionBox", selectedQuestionBox);
          // Find the selected question box by name
          const selectedBox = this.created_Box.find((box: any) => box.name === selectedQuestionBox);
          if (selectedBox) {
            // Check if candidates array already exists for this box
            if (!selectedBox.candidates) {
              selectedBox.candidates = []; // Initialize candidates array if not exists
            }
            // Check if the candidate is already assigned to this box
            const alreadyAssigned = selectedBox.candidates.some((c: any) => c.candidateId === candidate.candidateId);
            if (!alreadyAssigned) {
              // Push the candidate to the candidates array of the selected box
              selectedBox.candidates.push(candidate);
              // Remove the candidate from the candidates_list
              this.candidates_list = this.candidates_list.filter((item: any) => item.candidateId !== candidate.candidateId);
              // Remove the candidate from other question boxes if already assigned
              this.created_Box.forEach((s: any) => {
                if (s.candidates && s !== selectedBox) {
                  s.candidates = s.candidates.filter((c: any) => c.candidateId !== candidate.candidateId);
                }
              });
              console.log("Updated created_Box", this.created_Box);
            } else {
              console.log("Candidate already assigned to this box");
            }
          }
        }
      });
    }
  }

  selectQuestion(questionBox: any, id: any, name: any): void {
    this.questions_list = this.questions_list.filter((question: { questionId: any; }) => question.questionId !== id);
    if (questionBox) {
      console.log("questionBox", questionBox);
      this.selectedQuestion = name;
      this.selectedQuestionId = id;
      this.idListOpen = false;
      this.assignQuestion(this.selectedQuestionId, questionBox);
    }
  }

  assignQuestion(questionId: any, questionBox: any): void {
    console.log("questionBox", questionBox);
    const requestData = {
      questionBoxId: questionBox.id,
      questionId: questionId,
      questionServiceId: [] as string[]
    };
    // Get candidate service IDs for the current series
    if (questionBox.candidates && questionBox.candidates.length > 0) {
      console.log("questionBox <<<<", questionBox);
      questionBox.candidates.forEach((candidate: { serviceId: string }) => {
        if (candidate.serviceId) requestData.questionServiceId.push(candidate.serviceId);
      });
      console.log("requestData", requestData);

    }
    this.apiService.post(`/written-station/assign-question`, requestData).subscribe((res: any) => {
      console.log("resp", res);
      this.fetchCandidatesWithQuestionBox();
    });
  }

  onSwitchStation(candidate: any): void {
    console.log("candidate", candidate)
    if (candidate?.serviceStatus === 'pending') {
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

  viewProgressFile(progressFile: string) {
    window.open(`${environment.api_url}${progressFile}`, '_blank');
  }

  approve(): void {
    console.log("inside approve");
    const ScoreAddedTrue = this.candidatesStatus.some(candidate => candidate.serviceStatus !== 'done' && candidate.progressScore !== null);
    const ScoreAddedFalse = this.candidatesStatus.some(candidate => candidate.serviceStatus !== 'done' && candidate.progressScore == null);
    const averageScoreInput = document.getElementById('averageScore') as HTMLInputElement;
    const averageScore = averageScoreInput.value;
    const payload = {
      serviceId: this.requestId,
      averageScore: averageScore
    };
    if (ScoreAddedTrue) {
      console.log("ScoreAddedTrue");
      
      this.apiService.post(`/written-station/approve`, payload).subscribe({
        next: (res: any) => {
          this.tostr.success('Approved');
          this.averageScore = averageScore;
          this.fetchCandidatesWithQuestionBox();
        },
        error: (error) => {
          if (error?.status === 500) this.tostr.error("Internal Server Error");
          else this.tostr.warning("Unable to approve");
        }
      })
    } else if (ScoreAddedFalse) this.tostr.warning('Please add score');
  }

  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
    fileInput.click();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.s3Service.uploadImage(this.selectedFile, 'hr-service-images', this.selectedFile.name + '.png');
    }
  }
  // candidates_list: any[] = [];
  // requestId: any;
  // series_list: any[] = [];
  // newSeriesCreated: boolean = false;
  // activeSeries: any;
  // questions_list: any = [];
  // idListOpen: boolean = false;
  // showQuestions: boolean = false;
  // activeDropdownSeries: any = null;
  // selectedQuestionId: any;
  // selectedQuestionName: any;
  // questionAssigned: boolean = false;
  // questionSelected: boolean = false;
  // selectedQuestions: { [key: string]: { id: any, name: any } } = {};
  // candidatesStatus: any[] = [];
  // candidateResult: any[] = [];
  // previousAveragescore: any;
  // selectedCandidate: any;
  // selectedCandidateIds: any[] = [];
  // candidateMarkDetail: any;
  // averageScore: string | null = null;
  // showAverageScoreInput: boolean = false;
  // series_list_showAverageScoreInput: boolean = false;
  // demo: boolean = false;
  // teamName: any;
  // showAssignButton: boolean = false;
  // constructor(private http: HttpClient, private route: ActivatedRoute, private dialog: MatDialog, private tostr: ToastrServices, private apiService: ApiService) {
  //   this.route.queryParams.subscribe(params => {
  //     this.requestId = params['requestId'];
  //   });
  // }
  // ngOnInit(): void {
  //   this.fetchCandidates();
  //   this.fetchCandidatesWithSeries();
  //   this.fetchQuestions();
  // }

  // fetchCandidates(): void {
  //   this.apiService.get(`/screening-station/list-batch/${this.requestId}?station=2`).subscribe((res: any) => {
  //     if (res && res?.candidates) this.candidates_list = res?.candidates; else console.log("Failed to fetch candidates");

  //     this.showAverageScoreInput = this.candidates_list.some((candidate: any) => candidate.serviceStatus === 'pending');
  //   });
  // }

  // fetchCandidatesWithSeries(): void {
  //   // this.newSeriesCreated = false;
  //   this.apiService.get(`/written-station/questionBatchList/${this.requestId}`).subscribe((res: any) => {
  //     if (res?.data) this.candidatesStatus = res?.data; else console.log("erroer res?.data");

  //     console.log(" this.candidatesStatus", this.candidatesStatus);

  //     this.candidateResult = res.result;
  //     this.candidatesStatus[0].candidates.forEach((mark: any) => this.previousAveragescore = mark.progressAverageScore);
  //     if (res.result && res.data) {
  //       // Iterate over each series in the response
  //       res.data.forEach((item: any) => {
  //         const existingSeries = this.series_list.find((series: any) => series.questionId === item.questionId);
  //         // If the series already exists, update its candidates
  //         if (existingSeries) {
  //           // Update existing candidates and add new candidates
  //           item.candidates.forEach((newCandidate: any) => {
  //             const existingCandidateIndex = existingSeries.candidates.findIndex((existingCandidate: any) => existingCandidate.serviceId === newCandidate.serviceId);
  //             if (existingCandidateIndex !== -1) {
  //               // Update existing candidate
  //               existingSeries.candidates[existingCandidateIndex] = newCandidate;
  //             } else {
  //               // Add new candidate
  //               existingSeries.candidates.push(newCandidate);
  //             }
  //           });
  //         } else {
  //           // Otherwise, create a new series
  //           this.series_list = res.data.map((item: { questionId: any; questionName: any; candidates: any; }, index: number) => ({
  //             name: `Series ${index + 1}`,
  //             active: false,
  //             questionId: item.questionId,
  //             questionName: item.questionName,
  //             showQuestions: false,
  //             selectedQuestion: null,
  //             candidates: item.candidates
  //           }));
  //           console.log("this.series_list", this.series_list);

  //         }
  //       });
  //       this.newSeriesCreated = false;
  //       this.series_list.forEach((res: any) => {
  //         this.series_list_showAverageScoreInput = res.candidates.some((candidate: any) => candidate.progressAverageScore === null)
  //       })
  //     } else {
  //       this.tostr.error(res.message);
  //     }
  //   });
  // }

  // fetchQuestions(): void {
  //   this.showQuestions = true;
  //   this.apiService.get(`/written-station/questions`).subscribe((data: any) => {
  //     if (this.series_list.length > 0) {
  //       this.questions_list = data?.data.slice();
  //       this.series_list.forEach((series: any) => {
  //         this.questions_list = this.questions_list.filter((question: { questionId: any; }) => question.questionId !== series.questionId);
  //       });
  //     } else {
  //       this.questions_list = data?.data;
  //     }
  //   });
  // }

  // createSeries(): void {
  //   this.newSeriesCreated = true;
  //   const newSeries = {
  //     name: `Question Box${this.series_list.length + 1}`,
  //     questions: []
  //   };
  //   this.series_list.push(newSeries);
  //   this.activeSeries = newSeries;
  //   this.activeDropdownSeries = newSeries;
  // }

  // seriesBoxClick(series: any) {
  //   this.series_list.forEach((s: any) => s.active = false);
  //   series.active = true;
  //   this.activeSeries = series;
  //   this.activeDropdownSeries = series;
  // }

  // selectQuestion(series: any, id: any, name: any): void {
  //   this.questions_list = this.questions_list.filter((question: { questionId: any; }) => question.questionId !== id);
  //   if (series && series === this.activeSeries) {
  //     series.selectedQuestionId = id;
  //     series.selectedQuestionName = name;
  //     // Remove the selected question from the questions list array
  //     this.assignQuestion(id, series);
  //   }
  // }

  // assignQuestion(questionId: string, series: any): void {
  //   const requestData = {
  //     questionAssignee: null,
  //     questionId: questionId,
  //     questionServiceId: [] as string[]
  //   };
  //   // Get candidate service IDs for the current series
  //   if (series.candidates && series.candidates.length > 0) {
  //     console.log("series.candidates", series);
  //     this.teamName = series.teamName;
  //     series.candidates.forEach((candidate: { serviceId: string }) => {
  //       if (candidate.serviceId) requestData.questionServiceId.push(candidate.serviceId);
  //     });
  //   }
  //   this.apiService.post(`/written-station/assign-question`, requestData).subscribe((res: any) => {
  //     this.questionAssigned = true;
  //     this.fetchCandidatesWithSeries();
  //     this.fetchCandidates();
  //   });
  // }

  // openAssignModal(candidate: any, series: any) {
  //   if (this.series_list?.length == 0) {
  //     const dialogRef = this.dialog.open(AssignSeriesComponent, {
  //       height: '150px',
  //       width: '300px',
  //     })
  //   } else {
  //     const dialogRef = this.dialog.open(AssignSeriesComponent, {
  //       height: '265px',
  //       width: '477px',
  //       data: { seriesList: this.series_list, candidateServiceId: candidate?.serviceId }
  //     });
  //     dialogRef.afterClosed().subscribe((selectedSeries: string) => {
  //       if (selectedSeries) {
  //         let selectedSeriesObj = this.series_list.find((s: any) => s.name === selectedSeries || s.questionName === selectedSeries)
  //         if (selectedSeriesObj) {
  //           // Check if the candidate is already in the selected series
  //           if (selectedSeriesObj && selectedSeriesObj.candidates) var candidateExists = selectedSeriesObj.candidates.some((c: any) => c.candidateId === candidate.candidateId);
  //           if (!candidateExists) {
  //             // Remove the candidate from the candidate list
  //             this.candidates_list = this.candidates_list.filter((c: any) => c.candidateId !== candidate.candidateId);
  //             // Remove the candidate from the previous series candidate array
  //             this.series_list.forEach((s: any) => {
  //               if (s.candidates && s !== selectedSeriesObj) {
  //                 s.candidates = s.candidates.filter((c: any) => c.candidateId !== candidate.candidateId);
  //               }
  //             });
  //             // Add the candidate to the selected series 
  //             if (!candidate.progressId || this.questionAssigned) {
  //               selectedSeriesObj.candidates = selectedSeriesObj.candidates || [];
  //               selectedSeriesObj.candidates.push(candidate);
  //             }
  //             // this.series_list = [...this.series_list];
  //             if (selectedSeriesObj.questionName) {
  //               let questionId = selectedSeriesObj.questionId;
  //               selectedSeriesObj = selectedSeriesObj.candidates.filter((candidate: any) => !candidate.progressScore);
  //               const requestData = {
  //                 questionAssignee: null,
  //                 questionId: questionId,
  //                 questionServiceId: [] as string[]
  //               };
  //               console.log("selectedSeriesObj", selectedSeriesObj);

  //               // if (selectedSeriesObj[0].serviceId) requestData.questionServiceId.push(selectedSeriesObj[0].serviceId);
  //               // Push serviceIds for candidates without progressId
  //               selectedSeriesObj.forEach((candidate: any) => {
  //                 if (!candidate.progressId) {
  //                   requestData.questionServiceId.push(candidate.serviceId);
  //                 }
  //               });
  //               this.apiService.post(`/written-station/assign-question`, requestData).subscribe((res: any) => {
  //                 // this.newSeriesCreated = false;
  //                 this.showAssignButton = true;
  //                 this.questionAssigned = true;
  //                 // this.newSeriesCreated = false;
  //                 // this.fetchCandidatesWithSeries();
  //                 this.fetchCandidates();
  //                 this.fetchQuestions();

  //               });
  //             }
  //           } else {
  //             // Candidate already exists in the selected series
  //             this.tostr.warning('Candidate already assigned to this series');
  //           }
  //         } else this.tostr.warning('There is no selected series');
  //       }
  //     })
  //   }
  // }

  // resultClick(candidate: any, id: any): void {
  //   this.newSeriesCreated = false;
  //   this.selectedCandidate = candidate;
  //   this.selectedCandidateIds = id;
  //   const dialogRef = this.dialog.open(ResultComponent, {
  //     height: '430px',
  //     width: '600px',
  //     data: {
  //       candidateIds: this.selectedCandidateIds,
  //       candidate: this.selectedCandidate
  //     }
  //   }
  //   );
  //   dialogRef.componentInstance.scoreSubmitted.subscribe((score: number) => {
  //     this.selectedCandidate.examScore = score;
  //     this.candidateMarkDetail = {
  //       candidateIds: this.selectedCandidateIds,
  //       candidate: this.selectedCandidate,
  //       score: this.selectedCandidate.examScore
  //     }
  //     this.newSeriesCreated = false;
  //     this.fetchCandidatesWithSeries();
  //   });
  // }

  // onSwitchStation(candidate: any): void {
  //   console.log("candidate", candidate);

  //   if (candidate?.serviceStatus === 'pending') {
  //     const userId = localStorage.getItem('userId');
  //     const dialogRef = this.dialog.open(StationSwitchComponent, {
  //       data: {
  //         userId: userId,
  //         name: candidate['candidate.candidateFirstName'] + ' ' + candidate['candidate.candidateLastName'],
  //         serviceId: candidate?.serviceId,
  //         currentStation: 'Written',
  //         currentStationId: '2',
  //         requirement: candidate['reqServiceRequest.requestName']
  //       },
  //       width: '700px',
  //       height: '500px'
  //     })

  //     dialogRef.afterClosed().subscribe(() => {
  //       this.fetchCandidates();
  //       this.fetchCandidatesWithSeries();
  //     });
  //   } else {
  //     const dialogRef = this.dialog.open(WarningBoxComponent, {})
  //     dialogRef.afterClosed().subscribe(() => {
  //       this.fetchCandidates();
  //       this.fetchCandidatesWithSeries();
  //     });
  //   }
  // }

  // approve(): void {
  //   const ScoreAddedTrue = this.candidatesStatus.some(candidate => candidate.serviceStatus !== 'done' && candidate.progressScore !== null);
  //   const ScoreAddedFalse = this.candidatesStatus.some(candidate => candidate.serviceStatus !== 'done' && candidate.progressScore == null);
  //   const averageScoreInput = document.getElementById('averageScore') as HTMLInputElement;
  //   const averageScore = averageScoreInput.value;
  //   const payload = {
  //     serviceId: this.requestId,
  //     averageScore: averageScore
  //   };
  //   if (ScoreAddedTrue) {
  //     this.apiService.post(`/written-station/approve`, payload).subscribe({
  //       next: (res: any) => {
  //         this.tostr.success('Approved');
  //         this.averageScore = averageScore;
  //         this.fetchCandidatesWithSeries();
  //       },
  //       error: (error) => {
  //         if (error?.status === 500) this.tostr.error("Internal Server Error");
  //         else this.tostr.warning("Unable to approve");
  //       }
  //     })
  //   } else if (ScoreAddedFalse) this.tostr.warning('Please add score');
  // }

  // viewProgressFile(progressFile: string) {
  //   window.open(`${environment.api_url}${progressFile}`, '_blank');
  // }

}
