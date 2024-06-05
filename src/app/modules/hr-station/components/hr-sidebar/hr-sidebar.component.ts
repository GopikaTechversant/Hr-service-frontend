import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-hr-sidebar',
  templateUrl: './hr-sidebar.component.html',
  styleUrls: ['./hr-sidebar.component.css'],
  providers: [DatePipe],
})
export class HrSidebarComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {
    this.routerEventsSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.id = this.route.snapshot.firstChild?.params['id'];
      if (this.id) {
        this.candidateDetailUrl = `/hr/candidate-details/${this.id}`;
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
