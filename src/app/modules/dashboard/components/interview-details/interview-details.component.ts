import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-interview-details',
  templateUrl: './interview-details.component.html',
  styleUrls: ['./interview-details.component.css'],
  providers: [DatePipe],
})
export class InterviewDetailsComponent implements OnInit {
  showDropdown: boolean = false;
  displayDate: any;
  displayTime: any;
  displaydateTime: any;
  constructor(private datePipe: DatePipe, private cdr: ChangeDetectorRef) {

  }
  ngOnInit(): void {

  }

  option(): void {
    this.showDropdown = false;
  }
  dateChange(event: any): void {
    let date = new Date(event?.value);
    this.displayDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    console.log("this.displayDate", this.displayDate);
  }
  timeChange(event: any): void {
    console.log("event", event);
    this.displayTime = event;
    this.displaydateTime = `${this.displayDate} ${this.displayTime}`;
    // this.cdr.detectChanges();
    console.log("this.displaydateTime", this.displaydateTime);
  }


}
