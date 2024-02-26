import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environments';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-requirement-form',
  templateUrl: './requirement-form.component.html',
  styleUrls: ['./requirement-form.component.css'],
  providers: [DatePipe],
})
export class RequirementFormComponent implements OnInit {
  @ViewChild('stationInput') stationInput!: ElementRef<HTMLInputElement>;
  @ViewChild('serviceAssignee') serviceAssignee!: ElementRef<HTMLInputElement>;
  @ViewChild('serviceDate') serviceDate!: ElementRef<HTMLInputElement>;
  requestList_open: boolean = false;
  serviceList_open: boolean = false;
  experienceList_open: boolean = false;
  experience_droplist: any = [];
  list_experience: any = [];
  list_requests: any = [];
  list_services: any = [];
  selectedId: any;
  selectedName: any;
  selectedServiceId: any;
  selectedServiceName: any;
  selectedExperience: any;
  selectedExperienceId: any;
  candidates: any = [];
  candidateSelectAllStatus: boolean = false;
  selectedCandidateId: any = [];
  displayDate: any;
  isSelectedFresher: any = 0;
  isChecked: boolean = false;
  searchQuery: string = '';
  candidatesList: any[] = [];
  candidateSelect: boolean = false;
 today:any;
  constructor(private http: HttpClient, private datePipe: DatePipe, private tostr: ToastrService) { }
  ngOnInit(): void {
    this.today = new Date();
  }

  fetchRequirements(): void {
    this.http.get(`${environment.api_url}/service-request/list`).subscribe((res: any) => {
      if (res?.data) {
        this.list_requests = res?.data;
      }
    })
  }

  fetchCandidates(): void {
    this.http.get(`${environment.api_url}/screening-station/interview-details/candidates-list?serviceRequestId=${this.selectedId}`).subscribe((candidate: any) => {
      if (candidate?.candidates) {
        this.candidatesList = candidate?.candidates;
      }
    })
  }

  fetchcandidatesWithExperience(searchQuery: string): void {
    this.http.get(`${environment.api_url}/screening-station/interview-details/candidates-list?exprience=${this.searchQuery}`).subscribe((res: any) => {
      if (res?.candidates) {
        this.candidatesList = res?.candidates;
      }
    })
  }

  selectRequestId(name: any, id: any): void {
    this.requestList_open = false;
    if (this.selectedId !== id) {
      this.selectedName = name;
      this.selectedId = id;
      this.fetchCandidates();
    }
  }

  selectAllChange(event: any): void {
    this.selectedCandidateId = [];
    this.candidates.forEach((element: any) => {
      if (event?.target?.checked) {
        element.checked = true;
        this.selectedCandidateId.push(element?.candidateId);
      } else {
        element.checked = false;
      }
    });
  }

  candidateSelectChange(event: any, item: any): void {
    this.candidateSelect = !this.candidateSelect;
    if (this.candidateSelect) {
      if (this.selectedCandidateId.indexOf(item?.candidateId) === -1) {
        this.selectedCandidateId.push(item?.candidateId);
      }
    } else {
      const index = this.selectedCandidateId.indexOf(item?.candidateId);
      if (index > -1) {
        this.selectedCandidateId.splice(index, 1);
      }
    }
  }

  searchExperience(): void {
    this.fetchcandidatesWithExperience(this.searchQuery);
  }

  onClick(): void {
    this.isChecked = !this.isChecked;
  }

  sumitClick() {
    const requestData = {
      serviceServiceRequst: this.selectedId,
      serviceCandidates: this.selectedCandidateId,
      serviceAssignee: null,
      serviceDate: this.displayDate
    };

    this.http.post(`${environment.api_url}/screening-station/create`, requestData).subscribe((res: any) => {
      this.tostr.success('Requirement Created Successfully')
    },
      (error) => {
        if (error?.status === 500) this.tostr.error("Internal Server Error")
        else {
          this.tostr.warning("Unable to update");
        }
      })
  }

  dateChange(event: any): void {
    let date = new Date(event?.value);
    this.displayDate = this.datePipe.transform(date, 'yyyy-MM-dd');
  }
  resetFormAndState(): void {
    this.displayDate = null;
  }
  cancel(): void {
    this.resetFormAndState();
    this.selectedName = null;
    this.candidatesList = [];
  }
}
