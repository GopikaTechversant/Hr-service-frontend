import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-technical-sidebar',
  templateUrl: './technical-sidebar.component.html',
  styleUrls: ['./technical-sidebar.component.css']
})
export class TechnicalSidebarComponent implements OnInit {
  stationId: any;
  url: any;
  id: string | null = null;
  candidateDetailUrl: string = '';
  requisitionUrl: string = '';
  routerEventsSubscription: any;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.stationId = params['id'];
      this.url = `/technical/${this.stationId}`;
    });
    this.routerEventsSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.id = this.route.snapshot.firstChild?.params['id'];
      if (this.id) {
        this.candidateDetailUrl = `/technical/${this.stationId}/candidate-details/${this.id}`;
      }
    });
  }

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
