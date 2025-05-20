import { Component, Inject, OnInit, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { S3Service } from 'src/app/services/s3.service';
import { ToastrServices } from 'src/app/services/toastr.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-station-candidate-detail',
  templateUrl: './station-candidate-detail.component.html',
  styleUrls: ['./station-candidate-detail.component.css'],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
})
export class StationCandidateDetailComponent implements OnInit {
  private keySubscription?: Subscription;
  uploadedFileKey: string = '';
  candidateDetails: any;
  showRequest: boolean = false;
  progessAdded: boolean = false;
  serviceId: any = null
  stationId: any;
  feedback: any;
  userId: any;
  resumePath: any;
  file: File | null = null;
  fileName: any;
  messageType: string = '';
  showSelection: boolean = false;
  showRejection: boolean = false;
  isEditable: boolean = false;
  today: Date = new Date();
  templateData: any;
  feedbackCc: string = '';
  htmlString: string = '';
  feedbackSubject: string = '';
  content: any;
  buttonType: string = '';
  mailTemplateData: any;
  status: any;
  filteredStatus: string = '';
  filterStatus: boolean = false;
  loader: boolean = false;
  env_url: string = '';
  url: any;
  currentStation: string = '';
  rejectionFeedbackList: any;
  openRejectionFeedback: boolean = false;
  selectedRejectionFeedback: string = '';
  progressSkill: any = [];
  comment: any;
  // statusMessages: { [key: string]: string } = {
  //   done: 'Candidate Selected to Next Round',
  //   rejected: 'Candidate Rejected In this Round',
  //   moved: 'Candidate Moved From this Round',
  //   'back-off': 'Candidate Back-off In this Round',
  //   'pannel-rejection': 'Panel Rejected the candidate'
  // };
  statusMessages: { [key: string]: (station?: string) => string } = {
    done: (station?: string) => `Candidate Selected to ${station ? `${station}` : ''}`,
    rejected: (station?: string) => `Candidate Rejected In ${station ? `${station}` : ''}`,
    moved: (station?: string) => `Candidate Moved to ${station ? ` ${station}` : ''}`,
    'back-off': (station?: string) => `Candidate Back-off ${station ? ` at ${station}` : ''}`,
    'pannel-rejection': (station?: string) => `Panel Rejected the Candidate${station ? ` at ${station}` : ''}`
  };
  serviceAssignee:any;
  candidateId:any;
  serviceScheduledBy:any;
  userType: any;
  constructor(public dialogRef: MatDialogRef<StationCandidateDetailComponent>, private apiService: ApiService, private tostr: ToastrServices, private s3Service: S3Service,
    private route: ActivatedRoute, private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.candidateDetails = data?.candidateDetails;
      this.stationId = data?.stationId;
      this.serviceId = this.candidateDetails?.serviceId;
      this.progressSkill = this.candidateDetails?.skillScore
      this.serviceScheduledBy = this.candidateDetails?.serviceScheduledBy;
      this.candidateId = this.candidateDetails['candidate.candidateId'];
      this.serviceAssignee = this.candidateDetails?.serviceAssignee;
      if (data?.offerStatus > 0) this.progessAdded = true;
    }
    this.dialogRef.updateSize('60vw', '90vh');
    this.templateData = { message: '' };
  }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.filterStatus = false;
      this.openRejectionFeedback = false;
    }
  }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    if (this.data?.currentStation) this.currentStation = this.data?.currentStation?.split(' ')[0].toLowerCase();
    else this.currentStation = this.router.url.split('/')[1];
    if (this.data?.stationId) this.stationId = this.data?.stationId;
    else {
      this.route.params.subscribe(params => {
        this.stationId = params['id'];
        this.url = `/technical/${this.stationId}`;
      });
    }

    if (this.data?.stationId) this.stationId = this.data?.stationId;
    else this.stationId = localStorage.getItem('currentStationId');
    this.userId = localStorage.getItem('userId');
    this.env_url = window.location.origin;
    this.fetchFeedbackList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if(this.modalClose) this.fetchList();
    // if (changes['modalClose'] && !changes['modalClose'].isFirstChange()) this.fetchList();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  selectButton(type: any): void {
    this.buttonType = type;
    if (type === 'rejection') this.fetchStatus();
  }

  fetchFeedbackList(): void {
    this.apiService.get(`/screening-station/rejection-list`).subscribe(res => {
      this.rejectionFeedbackList = res?.data;
    });
  }

  fetchStatus(): void {
    this.apiService.get(`/user/filter-status`).subscribe(res => {
      this.status = res?.data.slice(4);
    });
  }

  selectStatusFilter(status: string) {
    this.filteredStatus = status;
  }

  selectRejectionFeedback(status: string) {
    this.selectedRejectionFeedback = status;
  }

  onFileSelected(event: any): void {
    const file: File = event?.target?.files?.[0];
    if (file) {
      this.file = file;
      this.fileName = file?.name;
      this.loader = true;
      if (this.fileName) this.s3Service.uploadImage(this.file, 'prod-ats-docs', this.file);
      this.getKeyFroms3();
    }
  }

  // onFileSelected(event: any): void {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     this.file = file;
  //     this.fileName = file?.name;
  //   }
  // }

  getKeyFroms3(): void {
    this.keySubscription = this.s3Service.key.subscribe((key: string) => {
      this.uploadedFileKey = key;
      if (!this.uploadedFileKey) {
        this.loader = false;
        this.tostr.error('Something Went Wrong Please Try Again');
      } else {
        this.loader = false;
        this.tostr.success('File upload Successfully');
      }
    });
  }

  getFormattedSkills(): any[] {
    // Check if we have skillScore data first
    if (this.candidateDetails?.skillScore?.length) {
        return this.candidateDetails.skillScore.map((skill: any) => ({
            name: skill.skillName || 'N/A',
            description: skill.description || 'N/A',
            score: skill.score || 'N/A'
        }));
    }
    
    // Fallback to skills array if skillScore is empty
    // if (this.candidateDetails?.skills?.length) {
    //     return this.candidateDetails.skills.map((skill: any) => ({
    //         name: skill.skillName || 'N/A',
    //         description: 'N/A',
    //         score: 'N/A'       
    //     }));
    // }
    
    // If no skills data at all
    return [];
}

parseProgressSkills(): any[] {
    if (!this.candidateDetails?.['progress.progressSkills']) return [];
    
    try {
        // Try to parse as JSON if it's stored that way
        return JSON.parse(this.candidateDetails['progress.progressSkills']);
    } catch (e) {
        // Fallback to text parsing if not JSON
        const skillLines = this.candidateDetails['progress.progressSkills'].split('\n')
            .filter((line: string) => line.trim() !== '');
        
        return skillLines.map((line: string) => {
            const match = line.match(/(.+?)\s*\((\d+)\/10\)/);
            return {
                name: match ? match[1].trim() : line.trim(),
                score: match ? match[2] : 'N/A',
                description: '' // Default empty description
            };
        });
    }
}

  onSubmitInterviewData(data: any) {
    if (data) {
      this.loader = true;
      const payload = {
        progressAssignee: this.userId,
        progressServiceId: this.serviceId?.toString() || '0',
        progressDescription: data?.progressDescription || '',
        progressSkill: data?.progressSkill,
        file: data?.file || '',
        progressComment: data?.progressComment || ''
      };

      const baseUrlMap: { [key: string]: string } = {
        'management': '/management-station',
        'technical-2': '/written-station',
        'technical-3': '/technical-station',
        'technical-4': '/technical-station-two'
      };

      const baseUrl = baseUrlMap[`${this.currentStation}-${this.stationId}`] || baseUrlMap[this.currentStation];
      if (!baseUrl) {
        this.tostr.error('Invalid operation');
        this.loader = false;
        return;
      }

      if (baseUrl) {
        this.apiService.post(`${baseUrl}/add-progress/v1`, payload).subscribe({
          next: () => {
            this.loader = false;
            this.tostr.success('Progress added successfully');
            this.closeDialog();
          },
          error: (err) => {
            this.loader = false;
            this.tostr.error(err?.error?.message ? err?.error?.message : 'Unable To Update Interview Details');
            this.closeDialog();
          }
        });
      } else {
        this.loader = false;
        this.tostr.error('Invalid operation');
      }
    }
  }

  showMail(item: string): void {
    if (item === 'approve') this.showSelection = true;
    if (item === 'rejection') this.showRejection = true;
    this.messageType = item;
    if (item.trim() !== '') {
      this.mailTemplateData = {
        firstName: this.candidateDetails['candidate.candidateFirstName'],
        lastName: this.candidateDetails['candidate.candidateLastName'],
        id: this.candidateDetails['candidate.candidateId'],
        messageType: this.messageType,
        stationId: this.stationId,
        serviceid: this.serviceId
      };
    }
  }

  onSubmitData(event: any): void {
    if (event?.clickType === 'cancel') this.cancelClick();
    if (event?.messageType === 'approve') this.approveClick(event);
    if (event?.messageType === 'rejection') this.rejectClick(event);
    if (event?.messageType === 're-schedule') this.rescheduleClick(event);
  }

  cancelClick(): void {
    this.closeDialog();
  }

  rescheduleClick(data: any): void {
    const userId = localStorage.getItem('userId');
    this.loader = true;
    const payload = {
      candidateId: this.candidateDetails['candidate.candidateId'],
      position: this.candidateDetails['serviceRequest.requestId'],
      interviewTime: data?.interviewTime,
      interViewPanel: data?.interviewPanel,
      interviewMode: data?.interviewMode,
      serviceId: this.candidateDetails?.serviceId,
      station: this.stationId,
      interviewStatus: data?.interviewStatus,
      comments: data?.feedback,
      interviewCc: data?.mailCc,
      interviewMailTemp: data?.mailTemp,
      interviewSubject: data?.mailSubject,
      interviewBcc: data?.mailBcc,
      recruiterId: userId
    }

    this.apiService.post(`/screening-station/interview-details`, payload).subscribe({
      next: (res: any) => {
        this.loader = false;
        this.tostr.success('Interview Re-Scheduled Successfully');
        this.closeDialog();
      },
      error: (error) => {
        this.loader = false;
        if (error?.status === 500) this.tostr.error("Internal Server Error");
        else this.tostr.error(error?.error?.message ? error?.error?.message : 'Unable to Reject Candidate');
        this.closeDialog();
      }
    });
    this.showMail('');
  }

  approveClick(data: any): void {
    this.loader = true;
    const baseUrlMap: { [key: string]: string } = {
      'management': '/management-station',
      'technical-2': '/written-station',
      'technical-3': '/technical-station',
      'technical-4': '/technical-station-two'
    };

    const baseUrl = baseUrlMap[`${this.currentStation}-${this.stationId}`] || baseUrlMap[this.currentStation];

    if (!baseUrl) {
      this.tostr.error('Invalid operation');
      this.loader = false;
      return;
    }

    const payload = {
      serviceSeqId: this.serviceId,
      feedBack: data?.feedback,
      feedBackBy: this.userId,
      feedBackCc: data?.mailCc,
      feedBackMailTemp: data?.mailTemp || '',
      feedBackSubject: data?.mailSubject,
      feedBcc: data?.mailBcc,
      date: data?.interviewTime,
      pannelUser: data?.interviewPanel,
      interviewMode: data?.interviewMode,
      requestionId: this.candidateDetails['serviceRequest.requestId']
    };
    this.apiService.post(`${baseUrl}/approve`, payload).subscribe({
      next: () => {
        this.tostr.success('Candidate Selected to Next Round');
        this.closeDialog();
        this.loader = false;
      },
      error: (error) => {
        this.loader = false;
        if (error?.status === 500) this.tostr.error("Internal Server Error");
        else this.tostr.error(error?.error?.message ? error?.error?.message : 'Unable to Schedule Interiew for next Round');
        this.closeDialog();
      },
      complete: () => {
        this.loader = false;
      }
    });
  }

  rejectClick(data: any): void {
    this.comment = (document.getElementById('comment') as HTMLInputElement)?.value || '';
    // this.loader = true;
    if (data || (this.comment && this.filteredStatus)) {
      this.loader = true;
      const payload = {
        serviceId: this.serviceId,
        stationId: this.stationId,
        userId: this.userId,
        status: this.filteredStatus ? this.filteredStatus : "rejected",
        rejectCc: data?.mailCc ?? '',
        rejectMailTemp: data?.mailTemp ?? '',
        rejectSubject: data?.mailSubject ?? '',
        rejectBcc: data?.mailBcc ?? '',
        // feedBack: data?.feedback ? data?.feedback : this.selectedRejectionFeedback,
        feedBack: data?.feedback ? data?.feedback : this.comment
      };
      this.apiService.post(`/screening-station/reject/candidate`, payload).subscribe({
        next: (res: any) => {
          this.loader = false;
          this.tostr.success('Candidate Rejected From this Round');
          this.closeDialog();
        },
        error: (error) => {
          this.loader = false;
          if (error?.status === 500) this.tostr.error("Internal Server Error");
          else this.tostr.error(error?.error?.message ? error?.error?.message : 'Unable to Reject Candidate');
          this.closeDialog();
        }
      });
    } else {
      if (!this.filteredStatus) this.tostr.warning('Please Select Reason for Rejection');
      if (!this.selectedRejectionFeedback) this.tostr.warning('Please Add Rejection Feedback');
    }
  }

  viewResume(resume: any) {
    this.resumePath = resume;
    window.open(`${environment.s3_url}${this.resumePath}`, '_blank');
  }

  ngOnDestroy(): void {
    if (this.keySubscription) {
      this.keySubscription.unsubscribe();
    }
  }
}
