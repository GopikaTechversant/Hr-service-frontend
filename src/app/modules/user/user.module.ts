import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
const routes: Routes = [
  { path:'',component:UserListComponent},
  // { path:'/detail',component:TechnicalDetailComponent},
  { path: '**', redirectTo:'', pathMatch: 'full' }

]

@NgModule({
  declarations: [
    UserListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
    
  ]
})
export class UserModule { }
