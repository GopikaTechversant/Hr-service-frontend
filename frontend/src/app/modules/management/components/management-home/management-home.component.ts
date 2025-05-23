import { Component } from '@angular/core';

@Component({
  selector: 'app-management-home',
  templateUrl: './management-home.component.html',
  styleUrls: ['./management-home.component.css']
})
export class ManagementHomeComponent {
  isSidebarHidden: boolean = false;

  ngOnInit(): void {
  }

  onToggleSidebarData(event: any): void {
    this.isSidebarHidden = event;
  }
}
