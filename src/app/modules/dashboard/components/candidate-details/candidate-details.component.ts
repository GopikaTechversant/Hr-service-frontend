import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-candidate-details',
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.css']
})
export class CandidateDetailsComponent implements OnInit {
  candidateId: any;
  candidateDetails: any;
  resumePath: any;
  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.candidateId = params['id'];
      this.fetchCandidateDetails();
    });
  }

  ngOnInit(): void {

  }

  fetchCandidateDetails(): void {
    this.http.get(`${environment.api_url}/candidate/list/${this.candidateId}`).subscribe((res: any) => {
      if (res?.data) {
        this.candidateDetails = res.data[0];
        console.log(this.candidateDetails);
        const container = document.getElementById('candidateDetailsContainer');

        if (container) { 
          for (const key in this.candidateDetails) {
            const value = this.candidateDetails[key];

            const displayValue = Array.isArray(value) ?
              value.map(item => JSON.stringify(item, null, 2)).join(', ') :
              value;

            const element = document.createElement('div');
            element.innerHTML = `
              <span class="title">${key}</span>
              <span class="value">${displayValue}</span>
            `;
            container.appendChild(element);
          }
        }
      }
    }); 
  }

  viewResume(resume: any) {
    this.resumePath = resume;
    window.open(`${environment.api_url}${this.resumePath}`, '_blank');
  }

}
