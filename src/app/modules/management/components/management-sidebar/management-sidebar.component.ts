import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-management-sidebar',
  templateUrl: './management-sidebar.component.html',
  styleUrls: ['./management-sidebar.component.css']
})
export class ManagementSidebarComponent implements OnInit{
  
  constructor(private router: Router, private route: ActivatedRoute){

  }

  ngOnInit(): void {
   
  }

  navigate(path: string): void {
    if(path === 'detail') this.router.navigate(['/detail']); 
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
