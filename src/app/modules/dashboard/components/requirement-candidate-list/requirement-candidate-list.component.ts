import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';
import { ApprovalStatusService } from 'src/app/services/approval-status.service';
@Component({
  selector: 'app-requirement-candidate-list',
  templateUrl: './requirement-candidate-list.component.html',
  styleUrls: ['./requirement-candidate-list.component.css']
})
export class RequirementCandidateListComponent implements OnInit {
  candidates_list: any = [];
  approvalStatus: boolean | undefined;
  constructor(private http: HttpClient, private router: Router, private approvalStatusService: ApprovalStatusService) { }

  ngOnInit(): void {
    this.fetchcandidates();
    this.approvalStatusService.approvalStatus.subscribe((status) => {
      this.approvalStatus = status;
    })
  }

  fetchcandidates(): void {
    this.http.get(`${environment.api_url}/screening-station/v1/list-all`).subscribe((res: any) => {
      console.log("fetch candidates", res);
      this.candidates_list = res.candidates;
    })
  }

  candidateSearch(): void {
  }

  navigateToRequirementForm(): void {
    // Use Router to navigate to the /requirement route
    this.router.navigate(['dashboard/requirement']);
  }
  // navigate(path:any, queryParam:any): void {
  //   console.log("clicked");

  //   if(queryParam) this.router.navigate([path], {queryParams: { type: queryParam}});
  //   else this.router.navigate([path]);
  // }
  navigate(path: any, requestId?: any): void {
    console.log("clicked");
    const queryParams = requestId ? { requestId: requestId } : undefined;
    if (queryParams) {
      this.router.navigate([path], { queryParams: queryParams });
    } else {
      this.router.navigate([path]);
    }
  }

}
