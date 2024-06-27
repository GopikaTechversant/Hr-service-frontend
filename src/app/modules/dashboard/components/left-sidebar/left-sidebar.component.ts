import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit {
  id: string | null = null;
  candidateDetailUrl: string = '';
  requisitionUrl: string = '';
  requirementUrl: string = '';
  routerEventsSubscription: any;
  requestId: string | null = null;
  constructor(private router: Router, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.routerEventsSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.id = this.route.snapshot.firstChild?.params['id'];
      this.requestId = this.route.snapshot.queryParams['requestId'];
      if (this.id) {
        this.candidateDetailUrl = `/dashboard/candidate-details/${this.id}`;
        this.requisitionUrl = `/dashboard/requisition-detail/${this.id}` || `/dashboard/series?requestId=${this.id}`;
      } 
      // else if (this.requestId) {
      //   this.requirementUrl = `/dashboard/series?requestId=${this.requestId}`;
      // }
    });
    this.updateUrls();
  }

  updateUrls(): void {
    this.id = this.route.snapshot.firstChild?.params['id'];
    if (this.id) {
      this.candidateDetailUrl = `/dashboard/candidate-details/${this.id}`;
      this.requisitionUrl = `/dashboard/requisition-detail/${this.id}`;
      this.requirementUrl = `/dashboard/series?requestId=${this.id}`;
    }
    // else if (this.requestId) {
    //   this.requirementUrl = `/dashboard/series?requestId=${this.requestId}`;
    // }
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
