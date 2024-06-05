import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddCandidateModalComponent } from './components/add-candidate-modal/add-candidate-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { TextFieldModule } from '@angular/cdk/text-field';
import { HttpClientModule } from '@angular/common/http';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { FormsModule } from '@angular/forms';
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
import { ReportDetailsComponent } from './components/report-details/report-details.component';
import { DailyReportComponent } from './components/daily-report/daily-report.component';
import { RequisitionDetailsComponent } from './components/requisition-details/requisition-details.component';
import { InterviewCountsBarComponent } from './components/interview-counts-bar/interview-counts-bar.component';
import { EditRequirementComponent } from './components/edit-requirement/edit-requirement.component';
import { CandidateDetailsComponent } from 'src/app/components/candidate-details/candidate-details.component';
import { InterviewDetailsComponent } from './components/interview-details/interview-details.component';
import { MaterialModule } from '../material/material.module';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '', component: LandingComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'service-requirement', component: ServiceRequestComponent },
      { path: 'candidate-list', component: RequirementCandidateListComponent },
      { path: 'add-candidate', component: AddCandidateModalComponent },
      { path: 'interview-details', component: InterviewDetailsComponent },
      { path: 'requirement-candidate-list', component: RequirementCandidateListComponent },
      { path: 'report-details', component: ReportDetailsComponent },
      { path: 'candidate-details/:id', component: CandidateDetailsComponent },
      { path: 'series', component: SeriesComponent },
      { path: 'requisition-detail/:id', component: RequisitionDetailsComponent }
    ]
  },
  { path: 'series', component: SeriesComponent },

]

@NgModule({
  declarations: [
    DashboardComponent,
    AddCandidateModalComponent,
    LeftSidebarComponent,
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
    ReportDetailsComponent,
    DailyReportComponent,
    RequisitionDetailsComponent,
    InterviewCountsBarComponent,
    EditRequirementComponent,
    InterviewDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    TextFieldModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    MatInputModule,
    MatDatepickerModule,
    SharedModule,
  ],
  exports: [RouterModule],
  providers: [
    DatePipe,
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ],
})

export class DashboardModule { }
