import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rejection-feedback',
  templateUrl: './rejection-feedback.component.html',
  styleUrls: ['./rejection-feedback.component.css']
})
export class RejectionFeedbackComponent implements OnInit{
  constructor(){}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
