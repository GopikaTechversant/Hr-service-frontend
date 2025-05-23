import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'app-logout-modal',
  templateUrl: './logout-modal.component.html',
  styleUrls: ['./logout-modal.component.css']
})
export class LogoutModalComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<LogoutModalComponent>, private router: Router) {
  }
  ngOnInit(): void {
  }
  logout(): void {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userFullName');
    this.router.navigate(['']);
    this.dialogRef.close();
  }
  cancel(): void {
    this.dialogRef.close();
  }
}
