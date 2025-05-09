import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-assign-requirement',
  templateUrl: './assign-requirement.component.html',
  styleUrls: ['./assign-requirement.component.css']
})
export class AssignRequirementComponent implements OnInit {
  requirementList: any[] = [];
  showDropdown: boolean = false;
  selectedRequirement: string = '';
  selectedRequirementId: any;
  candidatesid: any[] = [];
  candidates: any[] = [];
  userId: any;
  resumeSourceid: any;
  loader: boolean = false;
  requisitionData:any;
  constructor(public dialogRef: MatDialogRef<AssignRequirementComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService,
    private toastr: ToastrService) { }
  ngOnInit(): void {
    this.fetchRequirements();
    this.candidates = this.data.candidates;
    this.userId = this.data.userId;
    // this.requisitionData = this.data.requisitionData[0].reqServiceRequestLength;
  }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.showDropdown = false;
    }
  }

  fetchRequirements(): void {
    this.apiService.get(`/service-request/list`).subscribe((res: any) => {
      if (res?.data) {
        this.requirementList = res?.data;
      }
    })
  }

  selectRequirement(name: any, id: any): void {
    this.selectedRequirement = name;
    this.selectedRequirementId = id;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.loader = true;
    const payload = {
      requirementId: this.selectedRequirementId,
      userId: this.userId,
      candidates: this.candidates
    };
    if (this.candidates && this.selectedRequirementId) {
      this.apiService.post(`/screening-station/map-candidates-v1`, payload).subscribe({
        next: (res: any) => {
          this.loader = false;
          this.toastr.success('Assigned successfully');
          this.dialogRef.close();
        },
        error: (error) => {
          this.loader = false;
          this.toastr.error(error?.error?.message ? error?.error?.message : 'Candidates already assigned');
          this.dialogRef.close();
        }
      }
      )
    } else this.toastr.warning('Please Choose Requirement');
  }
}
