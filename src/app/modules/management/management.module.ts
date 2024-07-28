import { Component, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ManagementHomeComponent } from './components/management-home/management-home.component';
import { ManagementDetailComponent } from './components/management-detail/management-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { ManagementSidebarComponent } from './components/management-sidebar/management-sidebar.component';
import { ManagementCandidateListComponent } from './components/management-candidate-list/management-candidate-list.component';
import { CandidateDetailsComponent } from 'src/app/components/candidate-details/candidate-details.component';

const routes: Routes = [
  {
    path: '', component: ManagementHomeComponent,
    children: [
      { path: '', component:  ManagementCandidateListComponent},   
    ]
  },
]

@NgModule({
  declarations: [
    ManagementHomeComponent,
    ManagementDetailComponent,
    ManagementSidebarComponent,
    ManagementCandidateListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MaterialModule,
    FormsModule,

  ],
  providers: [
    DatePipe,
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ],
})
export class ManagementModule { }
