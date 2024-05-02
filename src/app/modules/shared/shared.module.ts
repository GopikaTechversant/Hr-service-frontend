import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SkeletonLoaderComponent } from 'src/app/components/skeleton-loader/skeleton-loader.component';


@NgModule({
  declarations: [
    HeaderComponent,
    SkeletonLoaderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxSkeletonLoaderModule
  ],
  exports: [
    HeaderComponent,
    SkeletonLoaderComponent,
    NgxSkeletonLoaderModule
  ]
})
export class SharedModule {}
