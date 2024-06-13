import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CandidateListComponent } from './components/candidate-list/candidate-list.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { SeriesComponent } from './components/series/series.component';
import { ResultComponent } from './components/result/result.component';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { AssignSeriesComponent } from './components/assign-series/assign-series.component';
import { FormsModule } from '@angular/forms';
import { CandidateDetailsComponent } from 'src/app/components/candidate-details/candidate-details.component';
import { MaterialModule } from '../material/material.module';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { CandidateAssignmentComponent } from './components/candidate-assignment/candidate-assignment.component';
const routes: Routes = [
  { path:'',component:HomeComponent,
  children: [
    {path:'',component: CandidateListComponent},
    {path:'series',component: SeriesComponent},
    {path:'candidates',component: CandidateAssignmentComponent}
  ]
 }
]

@NgModule({
  declarations: [
    CandidateListComponent,
    HomeComponent,
    SeriesComponent,
    ResultComponent,
    LeftSidebarComponent,
    AssignSeriesComponent,
    CandidateAssignmentComponent
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
export class WrittenStationModule { }
