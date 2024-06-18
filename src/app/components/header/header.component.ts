import { Component, OnInit, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LogoutModalComponent } from '../logout-modal/logout-modal.component';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  host: {
    '(document:click)': 'onBodyClick($event)'
  }
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebarData: EventEmitter<any> = new EventEmitter<any>();
  currentUser: any;
  dropDown: boolean = false;
  showDropDown: boolean = false;
  searchKeyword: string = '';
  candidateList: any;
  showCandidates: boolean = false;
  stationsList: any[] = [];
  headers: any;
  profileDropDown: any = [{ stationName: 'Users' }, { stationName: 'Log Out' }];
  isSidebarHidden: boolean = false;
  currentRole: any = '';
  activeStation: any;
  stationId: any;
  url: any;
  constructor(private apiService: ApiService, private dialog: MatDialog, private router: Router, private el: ElementRef, private route: ActivatedRoute) { }

  @HostListener('document:click', ['$event'])
  onBodyClick(event: Event): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.dropDown = false;
      this.showCandidates = false;
      this.searchKeyword = '';
    }
  }

  ngOnInit(): void {
    const currentStation = this.router.url.split('/')[1];
    this.route.params.subscribe(params => {
      this.stationId = params['id'];
      this.url = `/technical/${this.stationId}`;
    });
    if (currentStation === 'dashboard') this.activeStation = 'Screening';
    if (currentStation === 'written') this.activeStation = 'Written';
    if (currentStation === 'technical' && this.stationId === '3') this.activeStation = 'Technical 1';
    if (currentStation === 'technical' && this.stationId === '4') this.activeStation = 'Technical 2';
    if (currentStation === 'hr') this.activeStation = 'Hr Manager';
    if (currentStation === 'management') this.activeStation = 'Management';

    this.currentRole = localStorage.getItem('userRole');
    this.currentUser = localStorage.getItem('userFullName');
    this.fetchStations();
  }

  fetchStations(): void {
    this.apiService.get(`/user/stations`).subscribe((res: any) => {
      this.stationsList = res?.data;
    });
  }

  navigate(station: any): void {
    if (station?.stationName === 'Technical 1') {
      this.router.navigate([`/technical/${station?.stationId}`]);
      this.activeStation = 'Technical 1';
    } else if (station?.stationName === 'Technical 2') {
      this.router.navigate([`/technical/${station?.stationId}`]);
      this.activeStation = 'Technical 2';
    } else if (station?.stationName === 'Hr Manager') this.router.navigate(['/hr']);
    else if (station?.stationName === 'Screening') this.router.navigate(['/dashboard']);
    else if (station?.stationName === 'Written') this.router.navigate(['/written']);
    else if (station?.stationName === 'Management') this.router.navigate(['/management']);
    else if (station?.stationName === 'Users') this.router.navigate(['/user']);
    else if (station?.stationName === 'Log Out') this.logout();
    this.dropDown = false;
  }

  searchCandidate(searchKeyword: string): void {
    this.searchKeyword = searchKeyword;
    this.apiService.get(`/candidate/search/list?search=${this.searchKeyword}`).subscribe((res: any) => {
      if (res?.data) {
        this.candidateList = res?.data
        if (this.candidateList?.length > 0) this.showCandidates = true;
      }
    })
    if (this.searchKeyword.trim() === '') this.showCandidates = false;
  }

  selectCandidate(id: any): void {
    this.router.navigate([`candidate-details`, id], { relativeTo: this.route });
    this.searchKeyword = '';
  }

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
    this.toggleSidebarData.emit(this.isSidebarHidden);
  }

  profileClick() {
    this.dropDown = !this.dropDown;
  }

  logout() {
    const dialogRef = this.dialog.open(LogoutModalComponent, {
      width: '300px',
      height: '270px'
    })
  }
}
