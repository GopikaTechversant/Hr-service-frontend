import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MaterialModule } from '../material/material.module';
import { AddCandidateModalComponent } from './components/add-candidate-modal/add-candidate-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { TextFieldModule } from '@angular/cdk/text-field';
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
import { CandidateListComponent } from './components/candidate-list/candidate-list.component';
import { ApplicationListPieComponent } from './components/application-list-pie/application-list-pie.component';
import { ApplicationListBarComponent } from './components/application-list-bar/application-list-bar.component';
import { InterviewCountComponent } from './components/interview-count/interview-count.component';
import { DetailedRecruitmentComponent } from './components/detailed-recruitment/detailed-recruitment.component';
import { InterviewDetailsComponent } from './components/interview-details/interview-details.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReportDetailsComponent } from './components/report-details/report-details.component';
import { DailyReportComponent } from './components/daily-report/daily-report.component';

const routes: Routes = [
  {
    path: '', component: LandingComponent,
    children: [
      // {path: '', component: LeftSidebarComponent},
      { path: '', component: DashboardComponent },
      { path: 'requirement', component: RequirementFormComponent },
      { path: 'service-requirement', component: ServiceRequestComponent },
      { path: 'candidate-list', component: RequirementCandidateListComponent },
      { path: 'add-candidate', component: AddCandidateModalComponent },
      { path: 'interview-details', component: InterviewDetailsComponent },
      { path: 'requirement-candidate-list', component: RequirementCandidateListComponent },
      { path: 'report-details', component: ReportDetailsComponent },
      { path: 'candidate-details/:id', component: CandidateDetailsComponent }
    ]
  },
  { path: 'series', component: SeriesComponent },

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
    LandingComponent,
    CandidateListComponent,
    ApplicationListPieComponent,
    ApplicationListBarComponent,
    InterviewCountComponent,
    DetailedRecruitmentComponent,
    InterviewDetailsComponent,
    ReportDetailsComponent,
    DailyReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MaterialModule,
    TextFieldModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
  ],
  exports: [RouterModule],
  providers: [
    DatePipe,
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ],
})

export class DashboardModule { }
