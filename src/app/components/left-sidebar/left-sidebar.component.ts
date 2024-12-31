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
    { path: '/dashboard', label: 'Home', icon: 'fa fa-home' },
    { path: '/dashboard/requirement-candidate-list', label: 'Requisitions', icon: 'fa fa-list' },
    { path: '/dashboard/interview-details', label: 'Interview Details', icon: 'fa fa-laptop' },
    { path: '/dashboard/report-details', label: 'Report', icon: 'fa fa-file-text' },
    { path: '/dashboard/candidate-pool', label: 'Candidate Pool', icon: 'fa fa-users' }
  ];
  dynamicMenuItems: Array<{ path: string, label: string, icon: string }> = [];
  routerEventsSubscription: any;
  id: string | null = null;
  requestId: string | null = null;
  candidateScheduleUrl: any;
  seriesUrl: any;
  homePages: any;
  writtenCandidateList: any;
  userType: any;
  stationId: any;
  userRole:any;
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.userRole = localStorage.getItem('userRole');
    console.log("userType", this.userType);
    this.routerEventsSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => this.updateUrls());
    this.updateUrls();
  }

  get currentUrl(): string {
    return this.router.url;
  }

  updateUrls(): void {
    let homeUrl = this.currentUrl.split('/')[1];
    let stationId = null;

    // Assign stationId based on homeUrl
    switch (homeUrl) {
      case 'dashboard':
        stationId = '1'; // Example ID for Screening
        break;
      case 'technical':
        if (this.currentUrl.includes('/technical/2')) {
          stationId = '2'; // Example ID for Technical 1
        } else if (this.currentUrl.includes('/technical/3')) {
          stationId = '3'; // Example ID for Technical 1
        } else if (this.currentUrl.includes('/technical/4')) {
          stationId = '4'; // Example ID for Technical 2
        }
        break;
      case 'hr':
        stationId = '5'; // Example ID for HR Manager
        break;
      case 'management':
        stationId = '6'; // Example ID for Management
        break;
      case 'user':
        stationId = '0'; // Example ID for User List
        break;
    }

    // Store the resolved stationId
    this.stationId = stationId;

    localStorage.setItem('currentStationName', homeUrl === 'dashboard' ? 'screening' : homeUrl);
    localStorage.setItem('currentStationId', stationId || '0');
    const snapshot = this.route.snapshot;
    this.id = snapshot.firstChild?.params['id'] || null;
    this.requestId = snapshot.queryParams['requestId'] || null;
    this.dynamicMenuItems = [];
    const candidateDetailsUrl = `/dashboard/candidate-details/${this.id}`;
    this.seriesUrl = `/dashboard/series?requestId=${this.requestId}`;
    const requisitionDetailUrl = `/dashboard/requisition-detail/${this.id}`;
    this.candidateScheduleUrl = `/dashboard/candidate-schedule?requestId=${this.requestId}`;
    this.writtenCandidateList = `/written/candidates?requestId=${this.requestId}`

    if (this.currentUrl.includes(candidateDetailsUrl)) {
      this.dynamicMenuItems.push({ path: candidateDetailsUrl, label: 'Candidate Detail', icon: 'fa fa-user-circle' });
    }

    if (this.currentUrl.includes(this.seriesUrl)) {
      this.dynamicMenuItems.push({ path: this.seriesUrl, label: 'Requisition Detail', icon: 'fa fa-table' });
    }

    if (this.currentUrl.includes(requisitionDetailUrl)) {
      this.dynamicMenuItems.push({ path: requisitionDetailUrl, label: 'Requisition Detail', icon: 'fa fa-table' });
    }

    if (this.currentUrl.includes(this.candidateScheduleUrl)) {
      this.dynamicMenuItems.push({ path: this.candidateScheduleUrl, label: 'Candidate Lists', icon: 'fa fa-list-ol' });
    }

    if (this.currentUrl.includes(this.writtenCandidateList)) {
      this.dynamicMenuItems.push({ path: this.writtenCandidateList, label: 'Candidate List Technical 1', icon: 'fa fa-list-ol' });
    }

    if (homeUrl === 'dashboard' && this.currentUrl.includes(this.candidateScheduleUrl)) {
      this.dynamicMenuItems.push({ path: this.seriesUrl, label: 'Requisition Detail', icon: 'fa fa-table' });
    }

    if (this.userType === 'admin' && this.userType === 'admin') {
      this.dynamicMenuItems.push({ path: '/dashboard/admin', label: 'Admin Panel', icon: 'fa fa-user-plus' });
    }

    if (homeUrl === 'user' ) {
      if (this.userType === 'admin' || this.userRole === 'Manager') this.dynamicMenuItems.push({ path: '/user/addUser', label: 'Add User', icon: 'fa fa-user-plus' });
      this.dynamicMenuItems.push({ path: '/user/reset', label: 'Reset Password', icon: 'fa fa-key' });
    }

    if (homeUrl === 'hr') {
      this.dynamicMenuItems.push({ path: '/hr/selected-candidates', label: 'Selected Candidates', icon: 'fa fa-list-alt' });
    }

    if (homeUrl !== 'dashboard') {
      if (homeUrl === 'technical' && stationId === '2') this.dynamicMenuItems.push({ path: '/technical/2', label: 'Technical 1 List', icon: 'fa fa-tasks' });
      if (homeUrl === 'technical' && stationId === '3') this.dynamicMenuItems.push({ path: '/technical/3', label: 'Technical 2 List', icon: 'fa fa-tasks' });
      if (homeUrl === 'technical' && stationId === '4') this.dynamicMenuItems.push({ path: '/technical/4', label: 'Technical 3 List', icon: 'fa fa-tasks' });
      if (homeUrl === 'hr') this.dynamicMenuItems.push({ path: '/hr', label: 'H R List', icon: 'fa fa-tasks' });
      if (homeUrl === 'management') this.dynamicMenuItems.push({ path: '/management', label: 'Management List', icon: 'fa fa-tasks' });
      if (homeUrl === 'user') this.dynamicMenuItems.push({ path: '/user', label: 'User List', icon: 'fa fa-tasks' });
    }
  }

  ngOnDestroy(): void {
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }

  navigate(path: string): void {
    if (path === this.seriesUrl || path === this.candidateScheduleUrl || path === this.writtenCandidateList) {
      const requestId = path.split('requestId=')[1]
      const queryParams = requestId ? { requestId: requestId } : {};
      if (queryParams) this.router.navigate([path.split('requestId=')[0].split('?')[0]], { queryParams: queryParams });
    }
    else this.router.navigate([path]);
  }

  isActive(route: string): boolean {
    this.homePages = this.router.url.startsWith(route)
    return this.router.url === route;
  }

}
