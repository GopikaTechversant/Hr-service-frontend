import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MaterialModule } from '../material/material.module';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { SkeletonLoaderComponent } from 'src/app/components/skeleton-loader/skeleton-loader.component';
import { FileUploadS3Component } from 'src/app/components/file-upload-s3/file-upload-s3.component';
import { MailTemplateComponent } from 'src/app/components/mail-template/mail-template.component';
import { CandidateDetailsComponent } from 'src/app/components/candidate-details/candidate-details.component';
import { LeftSidebarComponent } from 'src/app/components/left-sidebar/left-sidebar.component';
import { StationCandidatesComponent } from 'src/app/components/station-candidates/station-candidates.component';
import { FeedbackComponent } from 'src/app/components/feedback/feedback.component';
import { DeleteComponent } from 'src/app/components/delete/delete.component';
import { EditComponent } from 'src/app/components/edit/edit.component';
import { LogoutModalComponent } from 'src/app/components/logout-modal/logout-modal.component';
import { StationCandidateDetailComponent } from 'src/app/components/station-candidate-detail/station-candidate-detail.component';
import { StationSwitchComponent } from 'src/app/components/station-switch/station-switch.component';
import { WarningBoxComponent } from 'src/app/components/warning-box/warning-box.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SkeletonLoaderComponent,
    FileUploadS3Component,
    MailTemplateComponent,
    CandidateDetailsComponent,
    LeftSidebarComponent,
    StationCandidatesComponent,
    FeedbackComponent,
    DeleteComponent,
    EditComponent,
    LogoutModalComponent,
    StationSwitchComponent,
    WarningBoxComponent,
    StationCandidateDetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
    MaterialModule,
  ],
  exports: [
    HeaderComponent,
    SkeletonLoaderComponent,
    NgxSkeletonLoaderModule,
    FileUploadS3Component,
    MailTemplateComponent,
    LeftSidebarComponent,
    CandidateDetailsComponent,
    StationCandidatesComponent
  ]
})
export class SharedModule { }
