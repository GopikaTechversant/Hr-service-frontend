import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CandidateListComponent } from './components/candidate-list/candidate-list.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
const routes: Routes = [
  { path:'',component:HomeComponent,
  children: [
    {path:'',component: CandidateListComponent},  ]
 }
]

@NgModule({
  declarations: [
    CandidateListComponent,
    HomeComponent,
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
export class WrittenStationModule { }
