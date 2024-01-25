import { Component, OnInit, Renderer2, ElementRef, HostListener } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { AddCandidateModalComponent } from 'src/app/modules/dashboard/components/add-candidate-modal/add-candidate-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: any;
  dropDown: boolean = false;
  constructor(private apiService: ApiService, private auth: AuthService, private dialog: MatDialog, private router: Router, private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {
    this.currentUser = this.auth.getUser();
  }

  @HostListener('document:click', ['$event'])
  onBodyClick(event: Event): void {
    // Check if the click is outside the dropdown element
    if (!this.el.nativeElement.contains(event.target)) {
      this.dropDown = false;
    }
  }

  profileClick() {
    this.dropDown = !this.dropDown;
    console.log("hfjiafhifh");
  }

  logout() {
    localStorage.removeItem('userToken');
    this.router.navigate(['']);
  }

  openAddCandidateModal(): void {
    const dialogRef = this.dialog.open(AddCandidateModalComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("after closed");
    })
  }

  navigate(path: any, queryParam: any): void {
    if (queryParam) this.router.navigate([path], { queryParams: { type: queryParam } });
    else this.router.navigate([path]);
  }

}
