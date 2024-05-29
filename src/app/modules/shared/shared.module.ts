import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { SkeletonLoaderComponent } from 'src/app/components/skeleton-loader/skeleton-loader.component';
import { FileUploadS3Component } from 'src/app/components/file-upload-s3/file-upload-s3.component';
import { MailTemplateComponent } from 'src/app/components/mail-template/mail-template.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    HeaderComponent,
    SkeletonLoaderComponent,
    FileUploadS3Component,
    MailTemplateComponent
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
    MailTemplateComponent
  ]
})
export class SharedModule {}
