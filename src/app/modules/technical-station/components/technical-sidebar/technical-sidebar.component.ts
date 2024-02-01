import { HttpClient } from '@angular/common/http';
import { Component, Input, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-technical-sidebar',
  templateUrl: './technical-sidebar.component.html',
  styleUrls: ['./technical-sidebar.component.css']
})
export class TechnicalSidebarComponent {
  @Input() selectedItem: any
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
  constructor(private http: HttpClient) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedItem'] && this.selectedItem) {
      this.progressAdd = false;
      this.serviceId = this.selectedItem.serviceId;
      this.statonId = this.selectedItem.serviceServiceId;
      this.progressAssignee = this.selectedItem.serviceAssignee;      
      if (this.selectedItem.serviceStatus === 'pending') this.showbtn = true;
      if (this.selectedItem.serviceStatus !== 'pending') this.showbtn = false;
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
        if (this.progressQuery.progressAssignee === this.selectedItem.serviceAssignee &&
          this.progressQuery.progressServiceId === this.selectedItem.serviceId) {
          this.showSkill = !!this.progressQuery.progressSkill;
          this.showScore = !!this.progressQuery.progressScore;
          this.showDescription = !!this.progressQuery.progressDescription;
          this.progressAdd = !!this.progressQuery.progressSkill && !!this.progressQuery.progressScore && !!this.progressQuery.progressDescription;
        }
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
      progressAssignee:  this.progressAssignee ? this.progressAssignee : '16' ,
      progressSkill: this.skillValue,
      progressServiceId: this.serviceId || 0,
      progressScore: this.scoreValue,
      progressDescription: this.descriptionValue
    };
    this.http.post(`${environment.api_url}/technical-station/add-progress`, this.progressQuery).subscribe({
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
      this.http.post(`${environment.api_url}/screening-station/reject/candidate`, this.rejectQuery).subscribe({
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

  approveClick(): void {
    this.approveQuery = {
      serviceSeqId: this.serviceId
    }
    if (this.progressAdd) {
      this.http.post(`${environment.api_url}/technical-station/approve`, this.approveQuery).subscribe({
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
