import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  isSidebarHidden: boolean = false;
  userRole: any = localStorage.getItem('userRole');
  ngOnInit(): void {
  }

  onToggleSidebarData(event: any): void {
    this.isSidebarHidden = event;
  }
}
