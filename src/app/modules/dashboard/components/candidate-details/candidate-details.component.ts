import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environments';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-candidate-details',
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.css']
})
export class CandidateDetailsComponent implements OnInit {
  candidateId: any;
  candidateDetails: any;
  resumePath: any;
  CandidateData: any;
  candidateFeedback: any;
  constructor(private apiService: ApiService, private route: ActivatedRoute, private datePipe: DatePipe) {
    this.route.params.subscribe(params => {
      this.candidateId = params['id'];
      this.fetchCandidateDetails();
    });
  }

  ngOnInit(): void {

  }

  fetchCandidateDetails(): void {
    this.apiService.get(`/candidate/list/${this.candidateId}`).subscribe((res: any) => {
      if (res?.data) {
        this.CandidateData = res?.data
        this.candidateDetails = res?.data[0];
        this.candidateFeedback = res?.comments
      }
    });
  }

  viewResume(resume: any) {
    this.resumePath = resume;
    window.open(`${environment.api_url}${this.resumePath}`, '_blank');
  }

}
