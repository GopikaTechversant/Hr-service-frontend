import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-assign-question',
  templateUrl: './assign-question.component.html',
  styleUrls: ['./assign-question.component.css']
})
export class AssignQuestionComponent implements OnInit {
  questions_list: any[] = [];
  showDropdown: boolean = false;
  candidateIdsQuestion: any;
  userId: any;
  questionName: string = '';
  questionId: any;
  recruiterId: any;

  constructor(public dialogRef: MatDialogRef<AssignQuestionComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService,
    private tostr: ToastrService) {
    this.candidateIdsQuestion = this.data.candidateIds;
  }

  ngOnInit(): void {
    this.fetchQuestions();
    this.recruiterId = localStorage.getItem('userId');

  }
  fetchQuestions(): void {
    this.apiService.get(`/written-station/questions`).subscribe((data: any) => {
      this.questions_list = data?.data;
    });
  }

  selectQuestion(name: string, id: string): void {
    this.questionName = name;
    this.questionId = id;
  }

  questionAssign(): void {
    const payload = {
      questionId: this.questionId,
      questionServiceId: this.candidateIdsQuestion,
      questionAssignee: this.recruiterId
    }
    if (this.candidateIdsQuestion && this.candidateIdsQuestion.length > 0) {
      this.apiService.post(`/written-station/assign-question`, payload).subscribe({
        next: (res: any) => {
          this.tostr.success('Question assigned successfully');
          this.dialogRef.close();
        },
        error: (error) => this.tostr.error('error?.error?.message ? error?.error?.message : Unable to assign question')
      })
    } else this.tostr.warning('The candidates already have assigned questions');
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {

  }
}
