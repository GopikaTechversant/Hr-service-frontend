import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HrHomeComponent } from './components/hr-home/hr-home.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HrSidebarComponent } from './components/hr-sidebar/hr-sidebar.component';
import { MaterialModule } from '../material/material.module';
import { HrCandidateListComponent } from './components/hr-candidate-list/hr-candidate-list.component';
import { HrCandidateDetailComponent } from './components/hr-candidate-detail/hr-candidate-detail.component';
import { FormsModule } from '@angular/forms';
import { SelectedCandidateListComponent } from './components/selected-candidate-list/selected-candidate-list.component';
const routes: Routes = [
  {
    path: '', component: HrHomeComponent,
    children: [
      { path: '', component:  HrCandidateListComponent},   
      { path: 'selected-candidates', component:  SelectedCandidateListComponent},   

    ]
  },
]
@NgModule({
  declarations: [
    HrHomeComponent,
    HrSidebarComponent,
    HrCandidateListComponent,
    HrCandidateDetailComponent,
    SelectedCandidateListComponent,  
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
  ],
})
export class HrStationModule { }
