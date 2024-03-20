import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-requirement-form',
  templateUrl: './requirement-form.component.html',
  styleUrls: ['./requirement-form.component.css'],
  providers: [DatePipe],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
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
  today: any;
  selected: boolean = false;
  candidate: any;
  constructor(private apiService: ApiService, private datePipe: DatePipe, private tostr: ToastrService) { }

  ngOnInit(): void {
    this.today = new Date();
  }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.requestList_open = false;
    }
  }

  fetchRequirements(): void {
    this.apiService.get(`apiService/service-request/list`).subscribe((res: any) => {
      if (res?.data) {
        this.list_requests = res?.data;
      }
    })
  }

  fetchCandidates(): void {
    this.apiService.get(`apiService/screening-station/interview-details/candidates-list?serviceRequestId=${this.selectedId}`).subscribe((candidate: any) => {
      if (candidate?.candidates) {
        this.candidatesList = candidate?.candidates;
      }
    })
  }

  fetchcandidatesWithExperience(searchQuery: string): void {
    this.apiService.get(`apiService/screening-station/interview-details/candidates-list?exprience=${this.searchQuery}`).subscribe((res: any) => {
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

  candidateSelectChange(item: any): void {
    this.candidate = item;
    this.candidate.selected = !this.candidate.selected;

    if (this.candidate !== null) {
      if (this.candidate.selected) {
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
    this.apiService.post(`/screening-station/create`, requestData).subscribe((res: any) => {
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
