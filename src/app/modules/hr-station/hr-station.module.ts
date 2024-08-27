import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HrHomeComponent } from './components/hr-home/hr-home.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { HrCandidateListComponent } from './components/hr-candidate-list/hr-candidate-list.component';
import { HrCandidateDetailComponent } from './components/hr-candidate-detail/hr-candidate-detail.component';
import { FormsModule } from '@angular/forms';
import { SelectedCandidateListComponent } from './components/selected-candidate-list/selected-candidate-list.component';
import { CandidateDetailsComponent } from 'src/app/components/candidate-details/candidate-details.component';
const routes: Routes = [
  {
    path: '', component: HrHomeComponent,
    children: [
      { path: '', component:  HrCandidateListComponent},   
      { path: 'selected-candidates', component:  SelectedCandidateListComponent},  
      { path: 'candidate-details/:id', component: CandidateDetailsComponent }, 

    ]
  },
]
@NgModule({
  declarations: [
    HrHomeComponent,
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
    DatePipe

  ],
  providers: [
    DatePipe,
  ],
})
export class HrStationModule { }
