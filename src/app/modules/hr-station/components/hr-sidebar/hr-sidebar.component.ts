import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hr-sidebar',
  templateUrl: './hr-sidebar.component.html',
  styleUrls: ['./hr-sidebar.component.css'],
  providers: [DatePipe],
})
export class HrSidebarComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void { }

  navigate(path: string): void {
    if (path === 'detail') this.router.navigate(['/detail']);

  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

}
