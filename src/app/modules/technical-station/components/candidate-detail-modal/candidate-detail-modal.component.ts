import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-candidate-detail-modal',
  templateUrl: './candidate-detail-modal.component.html',
  styleUrls: ['./candidate-detail-modal.component.css']
})
export class CandidateDetailModalComponent implements OnInit {
  candidateDetails: any;
  selectedItem: boolean = false;
  showRequest: boolean = false;
  showcandidates: boolean = false;
  showProgress: boolean = true;
  showbtn: boolean = false;
  scoreValue: string = '';
  descriptionValue: string = '';
  skillValue: string = '';
  progressAdd: boolean = false;
  progressQuery = {
    progressAssignee: "",
    progressSkill: "",
    progressServiceId: 0,
    progressScore: "",
    progressDescription: ""
  }
  serviceId: any = null
  progressAssignee: any = null;
  showSkill: boolean = false;
  showScore: boolean = false;
  showDescription: boolean = false;
  rejectQuery = {
    serviceId: "",
    stationId: 3
  }
  approveQuery = {
    serviceSeqId: 3
  };
  statonId: number = 0;
  showWarning: boolean = false;

  constructor(public dialogRef: MatDialogRef<CandidateDetailModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService) {
    if (data) {
      console.log(data);
      this.candidateDetails = data?.candidateDetails;
    }
    this.dialogRef.updateSize('50%', '70%')
  }

  ngOnInit(): void {
    this.progressAdd = false;
    this.serviceId = this.candidateDetails.serviceId;
    this.statonId = this.candidateDetails.serviceServiceId;
    this.progressAssignee = this.candidateDetails.serviceAssignee;
    if (this.candidateDetails.serviceStatus === 'pending') this.showbtn = true;
    if (this.candidateDetails.serviceStatus !== 'pending') this.showbtn = false;
    this.skillValue = '';
    this.scoreValue = '';
    this.descriptionValue = '';
    this.progressQuery = {
      progressAssignee: this.progressAssignee ? this.progressAssignee : '16',
      progressSkill: "",
      progressServiceId: this.serviceId || 0,
      progressScore: "",
      progressDescription: ""
    };
    this.showSkill = false;
    this.showScore = false;
    this.showDescription = false;
    const progress = sessionStorage.getItem('progress');
    if (progress) {
      this.progressQuery = JSON.parse(progress)
      if (this.progressQuery.progressAssignee === this.candidateDetails.serviceAssignee &&
        this.progressQuery.progressServiceId === this.candidateDetails.serviceId) {
        this.showSkill = !!this.progressQuery.progressSkill;
        this.showScore = !!this.progressQuery.progressScore;
        this.showDescription = !!this.progressQuery.progressDescription;
        this.progressAdd = !!this.progressQuery.progressSkill && !!this.progressQuery.progressScore && !!this.progressQuery.progressDescription;
      }
    }
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
    this.apiService.post(`/technical-station/add-progress`, this.progressQuery).subscribe({
      next: (res: any) => {
        this.progressAdd = true;
        sessionStorage.setItem('progress', JSON.stringify(this.progressQuery));
      },
      error: (error) => {
        console.error('Error adding progress', error);
      }
    });
  }

  rejectClick(): void {
    this.rejectQuery = {
      serviceId: this.serviceId,
      stationId: 3,
    }
    if (this.progressAdd) {
      this.apiService.post(`/screening-station/reject/candidate`, this.rejectQuery).subscribe({
        next: (res: any) => {
          this.showbtn = false;
        },
        error: (error) => {
          console.error('Error adding progress', error);
        }
      });
    } else this.showWarning = true;  
  }

  approveClick(): void {
    this.approveQuery = {
      serviceSeqId: this.serviceId
    }
    if (this.progressAdd) {
      this.apiService.post(`/technical-station/approve`, this.approveQuery).subscribe({
        next: (res: any) => {
          this.showbtn = false;
        },
        error: (error) => {
          console.error('Error adding progress', error);
        }
      });
    } else {
      this.showWarning = true;
    }
  }

}
