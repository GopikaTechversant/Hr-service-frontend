import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  candidates: any;
 lists:any[]=[];
  list = [
    {
      count: 250,
      name: 'Total Applicants',
      position: 'Senior Software Engineer',
      department: 'Javascript',
    },
    {
      count: 50,
      name: 'Shortlisted Candidates',
      position: 'Senior Software Engineer',
      department: 'Javascript',
    },
    {
      count: 20,
      name: 'Hired Candidates',
      position: 'Senior Software Engineer',
      department: 'Javascript',
    }, {
      count: 100,
      name: 'Rejected Candidates',
  
    }
  ];
  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    this.fetchcount();
  }
fetchcount():void{
  this.http.get(`${environment.api_url}/dashboard/card-data`).subscribe((res:any) => {
    console.log("res",res);
    this.lists = res.data;
  })
}

}
