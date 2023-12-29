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
import { RequirementsFormModalComponent } from './components/requirements-form-modal/requirements-form-modal.component';

const routes: Routes = [
  { path: '', component: DashboardComponent},
  { path: 'requirements', component: RequirementsFormModalComponent}
]

@NgModule({

  declarations: [
    DashboardComponent,
    AddCandidateModalComponent,
    LeftSidebarComponent,
    RequirementsFormModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    MaterialModule,
    TextFieldModule,
    HttpClientModule
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ],
})
export class DashboardModule { }
