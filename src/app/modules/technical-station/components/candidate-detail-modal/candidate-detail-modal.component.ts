import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { ToastrServices } from 'src/app/services/toastr.service';
@Component({
  selector: 'app-candidate-detail-modal',
  templateUrl: './candidate-detail-modal.component.html',
  styleUrls: ['./candidate-detail-modal.component.css']
})
export class CandidateDetailModalComponent implements OnInit {
  candidateDetails: any;
  showRequest: boolean = false;
  progessAdded: boolean = false;
  scoreValue: string = '';
  descriptionValue: string = '';
  skillValue: string = '';
  progressQuery = {
    progressAssignee: "",
    progressSkill: "",
    progressServiceId: 0,
    progressScore: "",
    progressDescription: ""
  }
  serviceId: any = null
  progressAssignee: any = null;
  stationId: any;

  constructor(public dialogRef: MatDialogRef<CandidateDetailModalComponent>, private apiService: ApiService, private tostr: ToastrServices,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.candidateDetails = data?.candidateDetails;
      this.stationId = data?.stationId;
      this.serviceId = this.candidateDetails?.serviceId;
      if (data?.progressStatus > 0) this.progessAdded = true;
    }
    this.dialogRef.updateSize('60vw', '90vh');
  }

  ngOnInit(): void { }

  closeDialog(): void {
    this.dialogRef.close();
  }

  addProgress(): void {
    const skillElement = document.getElementById('skill') as HTMLInputElement;
    this.skillValue = skillElement ? skillElement.value : '';
    const scoreElement = document.getElementById('score') as HTMLInputElement;
    this.scoreValue = scoreElement ? scoreElement.value : '';
    const descriptionElement = document.getElementById('description') as HTMLInputElement;
    this.descriptionValue = descriptionElement ? descriptionElement.value : '';

    this.progressQuery = {
      progressAssignee: this.progressAssignee ? this.progressAssignee : '16',
      progressSkill: this.skillValue,
      progressServiceId: this.serviceId || 0,
      progressScore: this.scoreValue,
      progressDescription: this.descriptionValue
    };
    let baseUrl = this.stationId === '3' ? `/technical-station` : this.stationId === '4' ? `/technical-station-two` : '';
    if (baseUrl) {
      this.apiService.post(`${baseUrl}/add-progress`, this.progressQuery).subscribe({
        next: (res: any) => {
          this.tostr.success('Progress added successfully');
          this.closeDialog();
        },
        error: (error) => {
          this.tostr.warning('Unable to Update Progress');
        }
      });
    } else {
      this.tostr.error('Invalid operation');
    }
  }


  rejectClick(): void {
    const userId = localStorage.getItem('userId');
    let payload = {
      serviceId: this.serviceId,
      stationId: this.stationId,
      userId : userId,
      status: "rejected",
    }
    this.apiService.post(`/screening-station/reject/candidate`, payload).subscribe({
      next: (res: any) => {
        this.closeDialog();
      },
      error: (error) => {
        this.tostr.error('Error adding progress');
      }
    });

  }

  approveClick(): void {
    let baseUrl = '';
    if (this.stationId === '3') baseUrl = `/technical-station`;
    if (this.stationId === '4') baseUrl = `/technical-station-two`;
    if (baseUrl) {
      const payload = { serviceSeqId: this.serviceId };
      this.apiService.post(`${baseUrl}/approve`, payload).subscribe({
        next: (res: any) => {
          this.tostr.success('Approval successful');
          this.closeDialog();
        },
        error: (error) => this.tostr.error('Error during approval')
      });
    } else this.tostr.error('Invalid operation');

  }


}
