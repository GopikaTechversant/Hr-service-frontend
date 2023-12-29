import { Component ,OnInit} from '@angular/core';
import { AddCandidateModalComponent } from 'src/app/modules/dashboard/components/add-candidate-modal/add-candidate-modal.component';
import { MatDialog } from '@angular/material/dialog';

import { Router } from '@angular/router';
@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit{
  isSidebarOpen = false;
  constructor(private dialog: MatDialog, private router: Router){}
  ngOnInit(): void {
    
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  openAddCandidateModal(): void{
    const dialogRef = this.dialog.open(AddCandidateModalComponent,{
      width :'700px'
    });
    dialogRef.afterClosed().subscribe(result =>{
      console.log("after closed");
      
    })
  }

  

  navigateToRequirements(): void {
    this.router.navigate(['/dashboard/requirements']);
  }
}