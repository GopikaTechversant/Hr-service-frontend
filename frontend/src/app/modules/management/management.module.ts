import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ManagementHomeComponent } from './components/management-home/management-home.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { ManagementCandidateListComponent } from './components/management-candidate-list/management-candidate-list.component';

const routes: Routes = [
  {
    path: '', component: ManagementHomeComponent,
    children: [
      { path: '', component: ManagementCandidateListComponent },
    ]
  },
]

@NgModule({
  declarations: [
    ManagementHomeComponent,
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
