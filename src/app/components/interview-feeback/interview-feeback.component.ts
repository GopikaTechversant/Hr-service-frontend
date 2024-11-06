import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { S3Service } from 'src/app/services/s3.service';
interface Skill {
  skillId: number;
  skillName: string;
  score: string;
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
      if (this.fileName) this.s3Service.uploadImage(this.file, 'hr-service-images', this.file);
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
      this.progressSkill.push({ skillId: this.selectedSkillId, skillName: this.searchvalue, score: this.selectedScore });
      this.selectedSkillId = '';
      this.searchvalue = '';
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
    const updatedSkill = this.progressSkill.map(({ skillName, ...rest }) => ({ ...rest }));
    if (updatedSkill.length > 0 && this.selectedFeedback) {
      const data = {
        file: this.uploadedFileKey,
        progressSkill: updatedSkill,
        progressDescription: this.selectedFeedback,
      };
      this.submitInterviewData.emit(data);
    } else {
      if(!this.selectedFeedback) this.tostr.warning('Please Add Feedback');
      if(updatedSkill.length === 0 ) this.tostr.warning('Please Add Skills');
    }
  }
}
