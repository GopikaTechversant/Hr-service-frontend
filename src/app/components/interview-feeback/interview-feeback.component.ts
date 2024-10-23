import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { S3Service } from 'src/app/services/s3.service';

@Component({
  selector: 'app-interview-feeback',
  templateUrl: './interview-feeback.component.html',
  styleUrls: ['./interview-feeback.component.css']
})
export class InterviewFeebackComponent implements OnInit {
  @Output() submitData: EventEmitter<any> = new EventEmitter<any>();
  @Input() loader: boolean = false;

  openFeedbackList: boolean = false;
  openCountList: boolean = false;
  selectedScore: string = '';
  showSkillOption: boolean = false;
  SkillTypeList: any = ['Technical Skill', 'Soft Skill'];
  feedbackList: any ;
  selectedFeedback: string = '';
  selectedSkillType: string = '';
  inputScore: string = '';
  sliderValue: number = 1; // Default value for the slide
  progressSkill: any = [];
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

  constructor(private s3Service: S3Service, private tostr: ToastrService, private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchFeedbackList();

  }

  fetchFeedbackList():void{
    this.apiService.get(`/screening-station/feedback-list`).subscribe(res => {
      this.feedbackList = res?.data;
    });
  }

  selectFeedback(type: string): void {
    this.openFeedbackList = false
    this.selectedFeedback = type;
  }

  onFileSelected(event: any): void {
    const file: File = event?.target?.files?.[0];
    if (file) {
      this.file = file;
      this.fileName = file?.name;
      this.loader = true;
      if (this.fileName) this.s3Service.uploadImage(this.file, 'hr-service-images', this.file);
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
      this.tostr.error('Please select both a skill and score before adding.');
    }
  }

  removeSkill(skillId: any): void {
    this.progressSkill = this.progressSkill.filter((skill: { skillId: any }) => skill.skillId !== skillId);
  }

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

  submitClick():void{
    const data = {
      file: this.uploadedFileKey,
      progressSkill: this.progressSkill,
      progressDescription: this.selectedFeedback,
      // interviewTime: this.displaydateTime,
    };
    this.submitData.emit(data);

  }
}
