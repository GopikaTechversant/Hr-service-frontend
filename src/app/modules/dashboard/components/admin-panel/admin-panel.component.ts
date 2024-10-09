import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  skillsList: any;
  initialLoader: boolean = false;
  loader: boolean = false;
  newSkill: string = '';

  constructor(private apiService: ApiService, private toastr: ToastrService) { }
  ngOnInit(): void {
    this.fetchSkill();
  }

  fetchSkill(): void {
    this.apiService.get(`/candidate/skills/list?search=`).subscribe(
      (res: any) => {
        if (res?.data) {
          this.skillsList = res?.data;
        }
        this.initialLoader = false;
      },
      (err: any) => {
        this.toastr.error('Error fetching skills');
        this.initialLoader = false;
      }
    );
  }

  removeSkill(item: any): void {
    this.loader = true;
    this.apiService.delete(`/candidate/delete/skill/${item?.id}`).subscribe(
      (res: any) => {
        if (res?.result) {
          this.toastr.success('Skill Deleted');
          this.fetchSkill();
        }
        this.loader = false;
      },
      (err: any) => {
        if (err.status === 500) {
          this.toastr.error('Internal Server Error, please try again later');
        } else {
          this.toastr.error(err?.error?.message || 'An error occurred while deleting the skill');
        }
        this.loader = false;
      }
    );
  }

  addSkill(skill: string): void {
    this.apiService.post(`/candidate/add/skill?skillName=${skill}`, '').subscribe({
      next: (res: any) => {
        this.toastr.success('Skill Added Successfully');
        this.newSkill = '';
        this.fetchSkill();
      },
      error: (err) => {
        if (err.status === 500) {
          this.toastr.error('Internal Server Error, please try again later');
        } else {
          this.toastr.error(err?.error?.message || 'An error occurred while Adding the skill');
        }
      }
    });
  }
}
