import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit, OnDestroy {
  id: string | null = null;
  candidateDetailUrl: string = '';
  requisitionUrl: string = '';
  requirementUrl: string = '';
  routerEventsSubscription: any;
  requestId: string | null = null;
  candidateScheduleurl: string = '';

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.routerEventsSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateUrls();
    });
    this.updateUrls();
  }

  get currentUrl(): string {
    return this.router.url;
  }

  updateUrls(): void {
    const snapshot = this.route.snapshot;
    this.id = snapshot.firstChild?.params['id'] || null;
    this.requestId = snapshot.queryParams['requestId'] || null;
    if (this.id) {
      this.candidateDetailUrl = `/dashboard/candidate-details/${this.id}`;
      this.requisitionUrl = `/dashboard/requisition-detail/${this.id}`;
    }
    if (this.requestId) {
      this.requirementUrl = `/dashboard/series?requestId=${this.requestId}`;
      this.candidateScheduleurl = `/dashboard/candidate-schedule?requestId=${this.requestId}`;
    }
  }

  ngOnDestroy(): void {
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }

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
