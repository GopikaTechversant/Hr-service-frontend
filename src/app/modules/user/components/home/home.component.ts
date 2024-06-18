import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isSidebarHidden: boolean = false;

  ngOnInit(): void {
  }

  onToggleSidebarData(event: any): void {
    this.isSidebarHidden = event;
  }
}