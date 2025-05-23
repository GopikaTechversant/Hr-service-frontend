import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TechnicalHomeComponent } from './components/technical-home/technical-home.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { TechnicalDetailComponent } from './components/technical-detail/technical-detail.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

const routes: Routes = [
  {
    path: '', component: TechnicalHomeComponent,
    children: [
      { path: '', component: TechnicalDetailComponent },   
    ]
  },
];

@NgModule({
  declarations: [
    TechnicalHomeComponent,
    TechnicalDetailComponent,
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
export class TechnicalStationModule { }
