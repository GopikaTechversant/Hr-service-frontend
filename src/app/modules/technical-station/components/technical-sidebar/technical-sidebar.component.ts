import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-technical-sidebar',
  templateUrl: './technical-sidebar.component.html',
  styleUrls: ['./technical-sidebar.component.css']
})
export class TechnicalSidebarComponent implements OnInit {
  stationId: any;
  url: any;
  
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.stationId = params['id'];
      this.url = `/technical/${this.stationId}`;      
    });
  }

  navigate(path: string): void {
    if(path === 'detail') this.router.navigate(['/detail']); 
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

}
