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
  constructor(private http: HttpClient) {
  }
  ngOnInit(): void {
    this.fetchRecruiterList();
  }
  fetchRecruiterList(): void {
    this.http.get(`${environment.api_url}/user/requirement-report?&page=${this.pageIndex}&limit=${this.pageSize}`).subscribe((res: any) => {
      this.candidateList = res.userRequirementReport;
    })
  }
  handlePageEvent(event: any) {
    console.log("event", event);
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchRecruiterList();
  }
}
