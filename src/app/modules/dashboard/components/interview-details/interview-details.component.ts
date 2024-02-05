import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-interview-details',
  templateUrl: './interview-details.component.html',
  styleUrls: ['./interview-details.component.css'],
  providers: [DatePipe],
})
export class InterviewDetailsComponent implements OnInit{
  showDropdown:boolean = false;
  displayDate: any;
constructor(private datePipe: DatePipe){

}
ngOnInit(): void {
  
}

option():void{
  this.showDropdown = false;
}
dateChange(event:any): void {
  let date = new Date(event?.value);
  this.displayDate = this.datePipe.transform(date, 'yyyy-MM-dd');
}
}
