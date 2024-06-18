import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  isSidebarHidden: boolean = false;

  ngOnInit(): void {
  }

  onToggleSidebarData(event: any): void {
    this.isSidebarHidden = event;
  }
}
