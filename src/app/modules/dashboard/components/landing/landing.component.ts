import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  isSidebarHidden: boolean = true;

  ngOnInit(): void {
  }

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }
}
