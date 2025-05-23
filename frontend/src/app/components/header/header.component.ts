import { Component, OnInit, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LogoutModalComponent } from '../logout-modal/logout-modal.component';

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
  userRole: any = localStorage.getItem('userRole');
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
    if (currentStation === 'technical' && this.stationId === '2') this.activeStation = 'Technical 1';
    if (currentStation === 'technical' && this.stationId === '3') this.activeStation = 'Technical 2';
    if (currentStation === 'technical' && this.stationId === '4') this.activeStation = 'Technical 3';
    if (currentStation === 'hr') this.activeStation = 'HR Manager';
    if (currentStation === 'management') this.activeStation = 'Management';

    this.currentRole = localStorage.getItem('userRole');
    this.userRole = (localStorage.getItem('userRole') || '').toLowerCase();
    this.currentUser = localStorage.getItem('userFullName');
    this.fetchStations();
  }

  fetchStations(): void {
    this.apiService.get(`/user/stations`).subscribe((res: any) => {
      this.stationsList = res?.data;
    });
  }

  navigate(station: any): void {
    if (!station) return;

    // const { stationName, stationId } = station;

    // Store station name and id in local storage
    localStorage.setItem('currentStationName', station.stationName);
    localStorage.setItem('currentStationId', station.stationId || '0');
    
    if (station?.stationName === 'Technical 1') {
      this.router.navigate([`/technical/${station?.stationId}`]);
      this.activeStation = 'Technical 1';
    } else if (station?.stationName === 'Technical 2') {
      this.router.navigate([`/technical/${station?.stationId}`]);
      this.activeStation = 'Technical 2';
    } else if (station?.stationName === 'Technical 3') {
      this.router.navigate([`/technical/${station?.stationId}`]);
      this.activeStation = 'Technical 3';
    } else if (station?.stationName === 'HR Manager') this.router.navigate(['/hr']);
    else if (station?.stationName === 'Screening') this.router.navigate(['/dashboard']);
    else if (station?.stationName === 'Written') this.router.navigate(['/written']);
    else if (station?.stationName === 'Management') this.router.navigate(['/management']);
    else if (station?.stationName === 'Users') this.router.navigate(['/user']);
    else if (station?.stationName === 'Log Out') this.logout();
    this.dropDown = false;
  }

  searchCandidate(searchKeyword: string): void {
    this.searchKeyword = searchKeyword;
    if (this.searchKeyword.trim() === '') {
      this.showCandidates = false;
      return;
    }
    this.apiService.get(`/candidate/search/list?search=${this.searchKeyword}`).subscribe((res: any) => {
      if (res?.data) {
        this.candidateList = res?.data;
        this.showCandidates = this.candidateList?.length > 0;
      }
    });
  }

  clearFilter(): void {
    this.searchKeyword = '';
  }

  selectCandidate(id: any): void {
    this.router.navigateByUrl(`/dashboard/candidate-details/${id}`);
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
