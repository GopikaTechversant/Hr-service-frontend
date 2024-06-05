import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-management-sidebar',
  templateUrl: './management-sidebar.component.html',
  styleUrls: ['./management-sidebar.component.css']
})
export class ManagementSidebarComponent implements OnInit{
  
  constructor(private router: Router, private route: ActivatedRoute) {
    this.routerEventsSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.id = this.route.snapshot.firstChild?.params['id'];
      if (this.id) {
        this.candidateDetailUrl = `/management/candidate-details/${this.id}`;
      }
    });
  }
  id: string | null = null;
  candidateDetailUrl: string = '';
  routerEventsSubscription: any;

  ngOnInit(): void { }


  navigate(path: string, queryParam: any): void {
    if (queryParam) {
      this.router.navigate([path], { queryParams: { type: queryParam } });
    } else {
      this.router.navigate([path]);
    }
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
