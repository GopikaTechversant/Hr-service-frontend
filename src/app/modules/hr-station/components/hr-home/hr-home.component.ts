import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-hr-home',
  templateUrl: './hr-home.component.html',
  styleUrls: ['./hr-home.component.css']
})
export class HrHomeComponent implements OnInit{
  candidateList: any = [];
  loader: boolean = false;
  selectedItem: any;
  constructor(private http:HttpClient){

  }
  ngOnInit(): void {
    this.fetchList();
  }
  fetchList(){
    this.http.get(`${environment.api_url}/hr-station/list`).subscribe((res:any) => {
      this.loader = false;
      console.log("response",res);
      
    })
  }
}
