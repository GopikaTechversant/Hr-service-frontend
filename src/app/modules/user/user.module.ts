import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { HomeComponent } from './components/home/home.component';
import { AddUserComponent } from './components/add-user/add-user.component';
const routes: Routes = [
  { path:'',component:HomeComponent,
  children: [
    {path:'',component: UserListComponent},
    {path:'addUser', component:AddUserComponent}
  ]
 }
]

@NgModule({
  declarations: [
    UserListComponent,
    LeftSidebarComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class UserModule { }
