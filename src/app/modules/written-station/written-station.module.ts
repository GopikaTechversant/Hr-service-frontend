import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateListComponent } from './components/candidate-list/candidate-list.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { SeriesComponent } from './components/series/series.component';
import { ResultComponent } from './components/result/result.component';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
const routes: Routes = [
  { path:'',component:HomeComponent,
  children: [
    {path:'',component: CandidateListComponent},
    {path:'series',component: SeriesComponent}
  ]
 }
]

@NgModule({
  declarations: [
    CandidateListComponent,
    HomeComponent,
    SeriesComponent,
    ResultComponent,
    LeftSidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class WrittenStationModule { }
