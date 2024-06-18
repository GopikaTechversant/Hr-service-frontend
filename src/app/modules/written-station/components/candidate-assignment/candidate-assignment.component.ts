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
  initialLoader: boolean = false
  loader: boolean = true;
  filterStatus: boolean = false;
  filteredStatus: any = '';
  displayPosition: string = '';
  positionId: any;
  requestList: any;
  selectedCandidate: any;
  selectedCandidateIds: any[] = [];
  candidateMarkDetail: any;
  candidateIds: any;
  resumePath: any;
  averageScore: string | null = null;
  experience: string = '';
  currentPage: number = 1;
  limit: number = 10
  totalCount: any;
  lastPage: any;
  Status: any = [
    { status: 'pending' },
    { status: 'rejected' },
    { status: 'done' },
    { status: 'moved' }
  ]
  requestList_open: any;
  displayQuestion_open: any;
  displayQuestion: string = '';
  questionId: any;
  candidateIdsQuestion: any;
  isExport: boolean = false;

  constructor(private route: ActivatedRoute, private dialog: MatDialog, private tostr: ToastrServices, private apiService: ApiService, private s3Service: S3Service) {
    this.route.queryParams.subscribe(params => {
      this.requestId = params['requestId'];
    });
  }

  ngOnInit(): void {
    this.initialLoader = true;
    this.fetchCandidates();
    this.fetchQuestions();
  }

  // fetchCandidates(): void {
  //   if (!this.initialLoader) this.loader = true;
  //   this.apiService.get(`/written-station/list-batch/${this.requestId}?experience=${this.experience.trim()}&status_filter=${this.filteredStatus}`).subscribe((res: any) => {
  //     this.initialLoader = false;
  //     this.loader = false;
  //     if (res && res?.candidates) this.candidateList = res?.candidates;
  //     console.log("this.candidateList", this.candidateList);
  //   });
  // }

  fetchCandidates(): void {
    if (!this.initialLoader) this.loader = true;
    const url = `/written-station/list-batch/${this.requestId}`
    let params = [
      `search=${this.searchKeyword}`,
      `page=${this.currentPage}`,
      `limit=${this.limit}`,
      `experience=${this.experience.trim()}`,
      `status_filter=${this.filteredStatus}`,
      `report=${this.isExport}`
    ].join('&');

    if (this.isExport) {
      if (this.candidateIds) {
        const idsParams = this.candidateIds.map((id: string) => `filterByIds=${id}`).join('&');
        params += `&${idsParams}`;
      }
      const exportUrl = `${environment.api_url}${url}?${params}`;
      console.log(exportUrl);
      window.open(exportUrl, '_blank');
      this.isExport = false;
      if (this.isExport === false) this.fetchCandidates();
      return;
    }
  
    this.apiService.get(`${url}?${params}`).subscribe((data: any) => {
      this.loader = false;
      this.initialLoader = false;
      if (data?.candidates) {
        this.candidateList = data?.candidates;
        console.log(" this.candidateList", data)
        this.totalCount = data?.total;
        const totalPages = Math.ceil(this.totalCount / this.limit);
        this.lastPage = totalPages;
        if (this.currentPage > totalPages) this.currentPage = totalPages;
      }
    });
  }

  fetchQuestions(): void {
    this.showQuestions = true;
    this.apiService.get(`/written-station/questions`).subscribe((data: any) => {
      this.questions_list = data?.data;
      console.log("his.questions_list ", this.questions_list);
    });
  }

  searchCandidate(searchTerm: string): void {
    console.log("searchTerm", searchTerm);
    this.searchKeyword = searchTerm;
    this.fetchCandidates();
  }

  searchByExperience(experience: string): void {
    this.experience = experience;
    // this.currentPage = 1;
    // this.limit = 10;
    this.fetchCandidates();
  }

  selectStatusFilter(item: string): void {
    this.filteredStatus = item;
    sessionStorage.setItem('status_written', this.filteredStatus);
    // this.currentPage = 1;
    // this.limit = 10;
    this.fetchCandidates();
  }

  clearFilter(item: any): void {
    if (item === 'status') {
      this.filteredStatus = '';
      sessionStorage.setItem('status_written', this.filteredStatus);
    }
    if (item === 'position') {
      this.displayPosition = '';
      this.positionId = '';
      sessionStorage.setItem(`position`, JSON.stringify({ name: this.displayPosition, id: this.positionId }));
    }
    if (item === 'search') this.searchKeyword = '';
    if (item === 'experience') this.experience = '';

    if (item === 'question') {
      this.displayQuestion = '';
      this.questionId = '';
      sessionStorage.setItem(`question`, JSON.stringify({ name: this.displayQuestion, id: this.questionId }));
    }
    // this.currentPage = 1;
    // this.limit = 10;
    this.fetchCandidates();
  }
  // clearFilter(item: any): void {
  //   if (item === 'search') this.searchKeyword = '';
  //   this.fetchCandidates();
  // }

  selectQuestion(name: string, id: string): void {
    this.requestList_open = false;
    this.displayPosition = name;
    this.positionId = id;
    this.questionAssign();
    sessionStorage.setItem(`position`, JSON.stringify({ name: this.displayPosition, id: this.positionId }));
    this.fetchCandidates();
  }

  filterQuestion(name: string, id: string): void {
    this.displayQuestion_open = false;
    this.displayQuestion = name;
    this.questionId = id;
    sessionStorage.setItem(`question`, JSON.stringify({ name: this.displayQuestion, id: this.questionId }));
    this.fetchCandidates();
  }

  questionAssign(): void {
    if (this.candidateIdsQuestion && this.candidateIdsQuestion.length > 0) {
      console.log("this.candidateIdsQuestion", this.candidateIdsQuestion);
      const payload = {
        questionId: this.positionId,
        questionServiceId: this.candidateIdsQuestion
      }
      console.log("question assigned api");
      this.apiService.post(`/written-station/assign-question`, payload).subscribe({
        next: (res: any) => {
          this.tostr.success('Question assigned successfully');
          this.fetchCandidates();
        },
        error: (error) => this.tostr.error('error?.error?.message ? error?.error?.message : Unable to assign question')
      })
    } else if (!this.candidateIds) this.tostr.warning('Please select candidates before assign question');
    else this.tostr.warning('Already Assigned');
  }

  onSwitchStation(candidate: any): void {
    console.log("candidate", candidate)
    if (candidate?.serviceSequence?.serviceStatus === 'pending' || candidate?.serviceSequence?.serviceStatus === 'rejected') {
      const userId = localStorage.getItem('userId');
      const dialogRef = this.dialog.open(StationSwitchComponent, {
        data: {
          userId: userId,
          name: candidate['candidate.candidateFirstName'] + ' ' + candidate['candidate.candidateLastName'],
          serviceId: candidate?.serviceSequence?.serviceId,
          currentStation: 'Written',
          currentStationId: '2',
          requirement: candidate['reqServiceRequest.requestName']
        },
        width: '700px',
        height: '500px'
      })
      dialogRef.afterClosed().subscribe(() => {
        this.fetchCandidates();
      });
    } else {
      const dialogRef = this.dialog.open(WarningBoxComponent, {})
      dialogRef.afterClosed().subscribe(() => {
        this.fetchCandidates();
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
      this.fetchCandidates();
    });
  }

  getSelectedCandidateServiceIds(): void {
    const selectedCandidates = this.candidateList.flat().filter((candidate: { isSelected: any; }) => candidate.isSelected);
    this.candidateIds = selectedCandidates.map((candidate: { serviceSequence: { serviceId: any; }; }) => candidate.serviceSequence?.serviceId);
    const candidatesWithoutQuertionName = this.candidateList.filter((candidate: { isSelected: any; serviceSequence: { progress: { quertionName: any; }; }; }) => candidate.isSelected && !candidate.serviceSequence?.progress?.quertionName);
    this.candidateIdsQuestion = candidatesWithoutQuertionName.map((candidate: { serviceSequence: { serviceId: any; }; }) => candidate.serviceSequence?.serviceId);
  }

  viewResume(resume: any) {
    this.resumePath = resume;
    console.log("this.resumePath", this.resumePath);
    window.open(`${environment.s3_url}${this.resumePath}`, '_blank');
    console.log("`${environment.s3_url}${this.resumePath}`", typeof (`${environment.s3_url}${this.resumePath}`));
  }

  approve(): void {
    const averageScoreInput = document.getElementById('averageScore') as HTMLInputElement;
    const averageScore = averageScoreInput.value;
    const isScoreAdded = this.candidateList.some((candidate: any) => {
      (candidate?.serviceSequence?.progress?.progressScore !== null || candidate?.serviceSequence?.progress?.progressScore) && candidate?.serviceSequence?.serviceStatus === 'pending';
    });
    const payload = {
      serviceId: this.requestId,
      averageScore: averageScore
    };
    if (!isScoreAdded && averageScore) {
      this.apiService.post(`/written-station/approve`, payload).subscribe({
        next: (res: any) => {
          this.tostr.success('Approved');
          this.averageScore = averageScore;
          this.fetchCandidates();
        },
        error: (error) => {
          if (error?.status === 500) this.tostr.error("Internal Server Error");
          else this.tostr.warning("Rejected due to a below-average score");
        }
      })
    }

  }

  exportData(): void {
    this.isExport = true;
    this.fetchCandidates();
  }


  generatePageNumbers() {
    let pages = [];
    if (this.lastPage <= 5) {
      for (let i = 1; i <= this.lastPage; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, this.currentPage - 1);
      let end = Math.min(this.lastPage - 1, this.currentPage + 1);

      if (this.currentPage <= 3) end = 4;
      else if (this.currentPage >= this.lastPage - 2) start = this.lastPage - 3;
      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < this.lastPage - 1) pages.push('...');
      pages.push(this.lastPage);
    }
    return pages;
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.fetchCandidates();
  }

}
