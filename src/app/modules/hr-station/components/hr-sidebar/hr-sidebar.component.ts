import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environments';
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

  ngOnInit(): void {}

  navigate(path: string): void {
    if(path === 'detail') this.router.navigate(['/detail']); 
  
  }

}
