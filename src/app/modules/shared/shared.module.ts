import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { SkeletonLoaderComponent } from 'src/app/components/skeleton-loader/skeleton-loader.component';
import { FileUploadS3Component } from 'src/app/components/file-upload-s3/file-upload-s3.component';
import { MailTemplateComponent } from 'src/app/components/mail-template/mail-template.component';
import { MaterialModule } from '../material/material.module';
import { CandidateDetailsComponent } from 'src/app/components/candidate-details/candidate-details.component';
import { LeftSidebarComponent } from 'src/app/components/left-sidebar/left-sidebar.component';
import { StationCandidatesComponent } from 'src/app/components/station-candidates/station-candidates.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SkeletonLoaderComponent,
    FileUploadS3Component,
    MailTemplateComponent,
    CandidateDetailsComponent,
    LeftSidebarComponent,
    CandidateDetailsComponent,
    StationCandidatesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxSkeletonLoaderModule,
    MaterialModule
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
export class SharedModule {}
