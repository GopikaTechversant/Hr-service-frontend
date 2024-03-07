import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-technical-sidebar',
  templateUrl: './technical-sidebar.component.html',
  styleUrls: ['./technical-sidebar.component.css']
})
export class TechnicalSidebarComponent implements OnInit {
  
  constructor(private router: Router) { }

  ngOnInit(): void {}

  navigate(path: string): void {
    if(path === 'detail') this.router.navigate(['/detail']); 
  
  }
}
