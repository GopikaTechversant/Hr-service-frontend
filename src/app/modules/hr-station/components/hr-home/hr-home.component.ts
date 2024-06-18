import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-hr-home',
  templateUrl: './hr-home.component.html',
  styleUrls: ['./hr-home.component.css']
})
export class HrHomeComponent implements OnInit {
  isSidebarHidden: boolean = false;

  ngOnInit(): void {
  }

  onToggleSidebarData(event: any): void {
    this.isSidebarHidden = event;
  }
}