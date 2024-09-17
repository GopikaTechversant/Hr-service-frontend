import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-interview-list',
  templateUrl: './interview-list.component.html',
  styleUrls: ['./interview-list.component.css']
})
export class InterviewListComponent implements OnInit{

loader: any;
initialLoader: any;
constructor(private apiService : ApiService){}
ngOnInit(): void {
  this.apiService.get(`/screening-station/todays-interview-list?search=&page=1&limit=10&position=&experience=&status_filter=&ids=&ids=`).subscribe((res: any) => {
    // if (res?.users) this.users_list = res?.users;
    console.log(res);
    
  })}

}
