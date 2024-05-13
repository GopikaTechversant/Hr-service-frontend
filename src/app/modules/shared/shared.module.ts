import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SkeletonLoaderComponent } from 'src/app/components/skeleton-loader/skeleton-loader.component';
import { FileUploadS3Component } from 'src/app/components/file-upload-s3/file-upload-s3.component';


@NgModule({
  declarations: [
    HeaderComponent,
    SkeletonLoaderComponent,
    FileUploadS3Component
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxSkeletonLoaderModule,
    // FileUploadS3Component,

  ],
  exports: [
    HeaderComponent,
    SkeletonLoaderComponent,
    NgxSkeletonLoaderModule,
    FileUploadS3Component,

  ]
})
export class SharedModule {}
