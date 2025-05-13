import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { S3Service } from 'src/app/services/s3.service';
interface Skill {
  skillId: number;
  skillName: string;
  score: string;
  description:any;
}

@Component({
  selector: 'app-interview-feeback',
  templateUrl: './interview-feeback.component.html',
  styleUrls: ['./interview-feeback.component.css'],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
})
export class InterviewFeebackComponent implements OnInit {
  @Output() submitInterviewData: EventEmitter<any> = new EventEmitter<any>();
  @Input() loader: boolean = false;
  @Input() candidateId: any;
  @Input() serviceScheduledBy:any;
  @Input() serviceAssignee: any;
  @ViewChild('score') scoreDiv!: ElementRef<HTMLDivElement>;
  openFeedbackList: boolean = false;
  openCountList: boolean = false;
  selectedScore: string = '';
  showSkillOption: boolean = false;
  SkillTypeList: any = ['Technical Skill', 'Soft Skill'];
  feedbackList: any;
  selectedFeedback: string = '';
  selectedSkillType: string = '';
  inputScore: string = '';
  sliderValue: number = 1; // Default value for the slide
  progressSkill: Skill[] = []; // Initialize as an empty array
  softSkills: any;
  fileName: any;
  file: any;
  keySubscription: any;
  uploadedFileKey: any;
  searchvalue: string = '';
  skillSuggestions: any;
  selectedSkillName: string = '';
  showSkill: boolean = false;
  selectedSkillId: any;
  fileUploader: boolean = false;
  comment: any;
  description: any;

  constructor(private s3Service: S3Service, private tostr: ToastrService, private apiService: ApiService, private el: ElementRef) { }

  ngOnInit(): void {
    this.fetchFeedbackList();
  }

  @HostListener('document:click', ['$event'])
  onBodyClick(event: Event): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.openFeedbackList = false;
      this.openCountList = false;
    }
  }


  onNotifyChange(event: any): void {
    
    if (event?.target?.checked) {
      
      console.log(this.selectedFeedback , "res");
      if (this.serviceAssignee && this.candidateId ) {
        const payload = {
          userId: +this.serviceAssignee, // '+' to convert to number
          candidateId: +this.candidateId,
        };
  
        this.apiService.post(`/dashboard/send-feedback-reminderMail`, payload).subscribe(
          (res: any) => {
            this.tostr.success('Reminder Mail Sent Successfully!');
          },
          (err: any) => {
            this.tostr.error('Failed to Send Reminder Mail.');
          }
        );
      } else {
        this.tostr.warning('Missing serviceAssignee or serviceCandidate in localStorage.');
      }
    }
  }
  

  fetchFeedbackList(): void {
    this.apiService.get(`/screening-station/feedback-list`).subscribe(res => {
      this.feedbackList = res?.data;
    });
  }

  selectFeedback(type: string): void {
    this.openFeedbackList = false;
    this.selectedFeedback = type;
  }

  onFileSelected(event: any): void {
    const file: File = event?.target?.files?.[0];
    if (file) {
      this.file = file;
      this.fileName = file?.name;
      this.fileUploader = true;
      if (this.fileName) this.s3Service.uploadImage(this.file, 'prod-ats-docs', this.file);
      this.getKeyFroms3();
    }
  }

  getSkillSuggestions(event: any): void {
    this.searchvalue = event;
    if (this.searchvalue) {
      this.apiService.get(`/candidate/skills/list?search=${this.searchvalue}`).subscribe((res: any) => {
        this.skillSuggestions = res?.data;
        if (this.skillSuggestions?.[0]) this.showSkill = true;
      });
    }
  }

  selectSkill(name: any, id: any): void {
    this.showSkill = false;
    this.searchvalue = name;
    this.selectedSkillId = id;
  }

  selectScore(numb: any): void {
    this.openCountList = false;
    this.selectedScore = numb;
  }

  addSkill(): void {
    if (this.selectedSkillId && this.selectedScore) {
      this.progressSkill.push({ skillId: this.selectedSkillId, skillName: this.searchvalue, score: this.selectedScore , description: this.description});
      this.selectedSkillId = '';
      this.searchvalue = '';
      this.description = '';
      this.selectedScore = '';
    } else {
      this.tostr.warning('Please select both a skill and score before adding.');
    }
  }

  removeSkill(skillId: any): void {
    this.progressSkill = this.progressSkill.filter((skill: { skillId: any }) => skill.skillId !== skillId);
  }

  getKeyFroms3(): void {
    this.keySubscription = this.s3Service.key.subscribe((key: string) => {
      this.uploadedFileKey = key;
      if (!this.uploadedFileKey) {
        this.fileUploader = false;
        this.tostr.error('Something Went Wrong Please Try Again');
      } else {
        this.fileUploader = false;
        this.tostr.success('File upload Successfully');
      }
    });
  }

  submitClick(): void {
    // const updatedSkill = this.scoreDiv.nativeElement.innerHTML;
    const updatedSkill = this.progressSkill;
    console.log("currentDescription", updatedSkill);
    
      
      if (this.serviceScheduledBy && this.candidateId ) {
        const payload = {
          userId: +this.serviceScheduledBy, // '+' to convert to number
          candidateId: +this.candidateId,
        };
  
        this.apiService.post(`/dashboard/send-feedback-reminderMail`, payload).subscribe(
          (res: any) => {
            this.tostr.success('Reminder Mail Sent Successfully!');
          },
          (err: any) => {
            this.tostr.error('Failed to Send Reminder Mail.');
          }
        );
      }
    

    // const updatedSkill = this.progressSkill.map(({ skillName, ...rest }) => ({ ...rest }));
    this.comment = (document.getElementById('comment') as HTMLInputElement)?.value || '';
    if (this.selectedFeedback && updatedSkill.length > 0 && this.comment.trim() !== '') {
      const data = {
        file: this.uploadedFileKey,
        progressSkill: updatedSkill,
        progressDescription: this.selectedFeedback,
        progressComment: this.comment
      };
      this.submitInterviewData.emit(data);
    } else {
      if (!this.selectedFeedback) this.tostr.warning('Please Add Feedback');
      if (this.comment === '') this.tostr.warning('Please add comment');
      if (!updatedSkill) this.tostr.warning('Please Add Skills and Score');
    }
  }

  // submitClick(): void {
  //   const updatedSkill = this.progressSkill.map(({ skillName, ...rest }) => ({ ...rest }));
  //   this.comment = (document.getElementById('comment') as HTMLInputElement)?.value || '';
  //   if (updatedSkill.length > 0 && this.selectedFeedback) {
  //     const data = {
  //       file: this.uploadedFileKey,
  //       progressSkill: updatedSkill,
  //       progressDescription: this.selectedFeedback,
  //       progressComment: this.comment
  //     };
  //     console.log("data submit",data);

  //     this.submitInterviewData.emit(data);
  //   } else {
  //     if (!this.selectedFeedback) this.tostr.warning('Please Add Feedback');
  //     if (updatedSkill.length === 0) this.tostr.warning('Please Add Skills');
  //     if (this.comment === '') this.tostr.warning('Please add comment');
  //   }
  // }
}
