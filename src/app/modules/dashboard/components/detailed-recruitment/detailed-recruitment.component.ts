import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detailed-recruitment',
  templateUrl: './detailed-recruitment.component.html',
  styleUrls: ['./detailed-recruitment.component.css']
})
export class DetailedRecruitmentComponent implements OnInit {
  chart: any;
  displayDate: any;
  currentLimit: any = 4;
  currentpage: number = 1;
  list: any = [
    {
      name: 'Amritha',
      position: 'TL-.NET',
      experience: 6,
      currentCompany: 'abcd',
      location: 'tvm',
      noticeperiod: 60,
      dateTime: '12,12,2000 3.00 PM',
      panel: 'Arun Antony',
      mode: 'Gmeet'
    },
    {
      name: 'Amritha',
      position: 'TL-.NET',
      experience: 6,
      currentCompany: 'abcd',
      location: 'tvm',
      noticeperiod: 60,
      dateTime: '12,12,2000 3.00 PM',
      panel: 'Arun Antony',
      mode: 'Gmeet'
    },
    {
      name: 'Amritha',
      position: 'TL-.NET',
      experience: 6,
      currentCompany: 'abcd',
      location: 'tvm',
      noticeperiod: 60,
      dateTime: '12,12,2000 3.00 PM',
      panel: 'Arun Antony',
      mode: 'Gmeet'
    },
    {
      name: 'Amritha',
      position: 'TL-.NET',
      experience: 6,
      currentCompany: 'abcd',
      location: 'tvm',
      noticeperiod: 60,
      dateTime: '12,12,2000 3.00 PM',
      panel: 'Arun Antony',
      mode: 'Gmeet'
    },
    {
      name: 'Amritha',
      position: 'TL-.NET',
      experience: 6,
      currentCompany: 'abcd',
      location: 'tvm',
      noticeperiod: 60,
      dateTime: '12,12,2000 3.00 PM',
      panel: 'Arun Antony',
      mode: 'Gmeet'
    },
    {
      name: 'Amritha',
      position: 'TL-.NET',
      experience: 6,
      currentCompany: 'abcd',
      location: 'tvm',
      noticeperiod: 60,
      dateTime: '12,12,2000 3.00 PM',
      panel: 'Arun Antony',
      mode: 'Gmeet'
    },
  ]
  constructor() {

  }
  ngOnInit(): void {

  }
  pageChange(event: any): void {
    let skip = parseInt(event, 10);
    this.currentpage = skip;
  }

}
