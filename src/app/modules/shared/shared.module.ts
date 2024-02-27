import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';


@NgModule({
  declarations: [
    HeaderComponent,
    PaginationComponent
    
  ],
  imports: [
    CommonModule, 
    FormsModule
  ],
  exports: [
    HeaderComponent,
    PaginationComponent
  ]
})
export class SharedModule { }
