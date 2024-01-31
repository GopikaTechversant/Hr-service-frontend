import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrHomeComponent } from './components/hr-home/hr-home.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HrSidebarComponent } from './components/hr-sidebar/hr-sidebar.component';

const routes: Routes = [
  { path:'',component:HrHomeComponent},
  { path: '**', redirectTo:'', pathMatch: 'full' }

]

@NgModule({
  declarations: [
    HrHomeComponent,
    HrSidebarComponent,
   
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class HrStationModule { }
