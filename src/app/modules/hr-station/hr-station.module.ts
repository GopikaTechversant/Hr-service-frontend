import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HrHomeComponent } from './components/hr-home/hr-home.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HrSidebarComponent } from './components/hr-sidebar/hr-sidebar.component';
import { MaterialModule } from '../material/material.module';
import { HrCandidateListComponent } from './components/hr-candidate-list/hr-candidate-list.component';
import { HrCandidateDetailComponent } from './components/hr-candidate-detail/hr-candidate-detail.component';
const routes: Routes = [
  {
    path: '', component: HrHomeComponent,
    children: [
      { path: '', component:  HrCandidateListComponent},   
    ]
  },
]
@NgModule({
  declarations: [
    HrHomeComponent,
    HrSidebarComponent,
    HrCandidateListComponent,
    HrCandidateDetailComponent,  
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MaterialModule
  ],
  providers: [
    DatePipe,
  ],
})
export class HrStationModule { }
