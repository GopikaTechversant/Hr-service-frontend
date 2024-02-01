import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MaterialModule } from '../material/material.module';
import { AddCandidateModalComponent } from './components/add-candidate-modal/add-candidate-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher ,ShowOnDirtyErrorStateMatcher} from '@angular/material/core';
import { TextFieldModule} from '@angular/cdk/text-field';
import { HttpClientModule } from '@angular/common/http';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';

import { CandidatelistComponent } from './components/candidatelist/candidatelist.component';
import { FormsModule } from '@angular/forms';
import { CandidateDetailsComponent } from './components/candidate-details/candidate-details.component';
import { RequirementFormComponent } from './components/requirement-form/requirement-form.component';
import { ServiceRequestComponent } from './components/service-request/service-request.component';
import { RequirementCandidateListComponent } from './components/requirement-candidate-list/requirement-candidate-list.component';
import { SeriesComponent } from './components/series/series.component';
import { LandingComponent } from './components/landing/landing.component';


const routes: Routes = [
  { path: '', component: LandingComponent,
  children: [
    // {path: '', component: LeftSidebarComponent},
    {path: '', component: DashboardComponent},
    {path: 'requirement', component: RequirementFormComponent},
    {path: 'service-requirement', component: ServiceRequestComponent},
    {path: 'candidate-list', component: RequirementCandidateListComponent},
   
  ]},
  {path: 'series', component: SeriesComponent}
  
]

@NgModule({

  declarations: [
    DashboardComponent,
    AddCandidateModalComponent,
    LeftSidebarComponent,
   
    CandidatelistComponent,
    CandidateDetailsComponent,
    RequirementFormComponent,
    ServiceRequestComponent,
    RequirementCandidateListComponent,
    SeriesComponent,
    LandingComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    MaterialModule,
    TextFieldModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ],
})
export class DashboardModule { }
