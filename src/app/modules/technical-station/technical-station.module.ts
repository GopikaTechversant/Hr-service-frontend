import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnicalHomeComponent } from './components/technical-home/technical-home.component';
import { TechnicalSidebarComponent } from './components/technical-sidebar/technical-sidebar.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { TechnicalDetailComponent } from './components/technical-detail/technical-detail.component';
import { CandidateDetailModalComponent } from './components/candidate-detail-modal/candidate-detail-modal.component';
import { MaterialModule } from '../material/material.module';

const routes: Routes = [
  {
    path: '', component: TechnicalHomeComponent,
    children: [
      { path: '', component:  TechnicalDetailComponent},   
    ]
  },
]
  
@NgModule({
  declarations: [
    TechnicalHomeComponent,
    TechnicalSidebarComponent,
    TechnicalDetailComponent,
    CandidateDetailModalComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MaterialModule
  ]
})
export class TechnicalStationModule { }
