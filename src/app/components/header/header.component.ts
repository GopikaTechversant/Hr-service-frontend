import { Component, OnInit, Renderer2, ElementRef, HostListener } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { AddCandidateModalComponent } from 'src/app/modules/dashboard/components/add-candidate-modal/add-candidate-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  currentUser: any;
  dropDown: boolean = false;
  showDropDown: boolean = false;
  searchKeyword: string = '';
  candidateList: any;
  showCandidates: boolean = false;
  stationsList: any[] = [];
  headers: any;
  constructor(private http: HttpClient, private apiService: ApiService, private auth: AuthService, private dialog: MatDialog, private router: Router, private renderer: Renderer2, private el: ElementRef) { }

  @HostListener('document:click', ['$event'])
  onBodyClick(event: Event): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.dropDown = false;
      this.showCandidates = false;
    }
  }

  ngOnInit(): void {
    this.currentUser = localStorage.getItem('userRole');
    this.fetchStations();
  }

  fetchStations(): void {
    this.apiService.get(`/user/stations`).subscribe((res: any) => {
      this.stationsList = res.data;
    });
  }

  navigate(station: any): void {
    if (station?.stationName === 'Technical 1') this.router.navigate([`/technical/${station?.stationId}`]);
    else if (station?.stationName === 'Technical 2') this.router.navigate([`/technical/${station?.stationId}`]);
    else if (station?.stationName === 'Hr Manager') this.router.navigate(['/hr']);
    else if (station?.stationName === 'Screening') this.router.navigate(['/dashboard']);
    else if (station?.stationName === 'Written') this.router.navigate(['/written']);
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
  }

  selectCandidate(id: any): void {
    this.router.navigateByUrl(`/dashboard/candidate-details/${id}`);
  }

  profileClick() {
    this.dropDown = !this.dropDown;
  }

  logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    this.router.navigate(['']);
  }

  openAddCandidateModal(): void {
    const dialogRef = this.dialog.open(AddCandidateModalComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(result => {
    })
  }

}
