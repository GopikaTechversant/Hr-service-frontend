import { Component } from '@angular/core';

@Component({
  selector: 'app-technical-home',
  templateUrl: './technical-home.component.html',
  styleUrls: ['./technical-home.component.css']
})
export class TechnicalHomeComponent {
  isSidebarHidden: boolean = false;

  ngOnInit(): void {
  }

  onToggleSidebarData(event: any): void {
    this.isSidebarHidden = event;
  }
}
