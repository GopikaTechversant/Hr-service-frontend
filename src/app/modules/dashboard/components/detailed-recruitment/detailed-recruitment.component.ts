import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';
@Component({
  selector: 'app-detailed-recruitment',
  templateUrl: './detailed-recruitment.component.html',
  styleUrls: ['./detailed-recruitment.component.css']
})
export class DetailedRecruitmentComponent implements OnInit {
  chart: any;
  displayDate: any;
  length: any = 20;
  pageSize = 4;
  pageIndex = 1;
  pageSizeOptions = [5, 10, 15, 20];
  showFirstLastButtons = true;
  candidateList: any[] = [];
  recruitersList: any[] = [];
  recruitersListOpen: boolean = false;
  selectedRecruitername: string = '';
  selectedRecruiterId: any;
  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.fetchCandidateList('');
    this.fetchRecruitersList();
  }

  fetchCandidateList(recruiter:string): void {
   
    this.http.get(`${environment.api_url}/dashboard/requirement-report?recuriter=${recruiter}&page=${this.pageIndex}&limit=${this.pageSize}`).subscribe((res: any) => {
      this.candidateList = res.userRequirementReport;
    })
  }
  fetchRecruitersList(): void {
    this.http.get(`${environment.api_url}/dashboard/recruiter-list`).subscribe((res: any) => {
      this.recruitersList = res?.data;
      console.log("  this.recruitersList", this.recruitersList);
    })
  }

  selectedRecruiter(id: number, name: string): void {
    this.selectedRecruitername = name;
    this.selectedRecruiterId = id;
    this.recruitersListOpen = false;
    this.fetchCandidateList(this.selectedRecruiterId)
    console.log();
  }
  handlePageEvent(event: any) {
    console.log("event", event);
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchCandidateList('');
  }
}
