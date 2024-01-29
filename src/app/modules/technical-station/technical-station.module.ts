import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnicalHomeComponent } from './components/technical-home/technical-home.component';
import { TechnicalSidebarComponent } from './components/technical-sidebar/technical-sidebar.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { TechnicalDetailComponent } from './components/technical-detail/technical-detail.component';

const routes: Routes = [
  { path:'',component:TechnicalHomeComponent},
  // { path:'/detail',component:TechnicalDetailComponent},
  { path: '**', redirectTo:'', pathMatch: 'full' }

]

@NgModule({
  declarations: [
    TechnicalHomeComponent,
    TechnicalSidebarComponent,
    TechnicalDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class TechnicalStationModule { }
