import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit, OnDestroy {
  staticMenuItems: Array<{ path: string, label: string, icon: string }> = [
    { path: '/dashboard', label: 'Dashboard', icon: 'fa fa-th-large' },
    { path: '/dashboard/requirement-candidate-list', label: 'Requisitions', icon: 'fa fa-list' },
    { path: '/dashboard/interview-details', label: 'Interview Details', icon: 'fa fa-laptop' },
    { path: '/dashboard/report-details', label: 'Report', icon: 'fa fa-file-text' },
    { path: '/dashboard/candidate-pool', label: 'Candidate Pool', icon: 'fa fa-users' }
  ];
  dynamicMenuItems: Array<{ path: string, label: string, icon: string }> = [];
  routerEventsSubscription: any;
  id: string | null = null;
  requestId: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.routerEventsSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => this.updateUrls());
    this.updateUrls();
  }

  get currentUrl(): string {    
    return this.router.url;
  }

  updateUrls(): void {
    const snapshot = this.route.snapshot;
    this.id = snapshot.firstChild?.params['id'] || null;
    this.requestId = snapshot.queryParams['requestId'] || null;
  
    this.dynamicMenuItems = [];
    console.log(this.currentUrl);
  
    const candidateDetailsUrl = `/dashboard/candidate-details/${this.id}`;
    const seriesUrl = `/dashboard/series?requestId=${this.requestId}`;
    const requisitionDetailUrl = `/dashboard/requisition-detail/${this.id}`;
    const candidateScheduleUrl = `/dashboard/candidate-schedule?requestId=${this.requestId}`;
  
    if (this.currentUrl.includes(candidateDetailsUrl)) {
      this.dynamicMenuItems.push({ path: candidateDetailsUrl, label: 'Candidate Detail', icon: 'fa fa-user-circle' });
    }
  
    if (this.currentUrl.includes(seriesUrl)) {
      this.dynamicMenuItems.push({ path: seriesUrl, label: 'Requisition Detail', icon: 'fa fa-table' });
    }
  
    if (this.currentUrl.includes(requisitionDetailUrl)) {
      this.dynamicMenuItems.push({ path: requisitionDetailUrl, label: 'Requisition Detail', icon: 'fa fa-table' });
    }
  
    if (this.currentUrl.includes(candidateScheduleUrl)) {
      this.dynamicMenuItems.push({ path: candidateScheduleUrl, label: 'Candidate Lists', icon: 'fa fa-list-ol' });
    }
  }
  
  ngOnDestroy(): void {
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }

  navigate(path: string): void {    
    this.router.navigate([path]);
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
