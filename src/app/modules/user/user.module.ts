import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { HomeComponent } from './components/home/home.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { EditComponent } from './components/edit/edit.component';
import { CandidateDetailsComponent } from 'src/app/components/candidate-details/candidate-details.component';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
const routes: Routes = [
  { path:'',component:HomeComponent,
  children: [
    {path:'',component: UserListComponent},
    {path:'addUser', component:AddUserComponent},
    { path: 'candidate-details/:id', component: CandidateDetailsComponent },

  ]
 }
]

@NgModule({
  declarations: [
    UserListComponent,
    LeftSidebarComponent,
    HomeComponent,
    AddUserComponent,
    EditComponent
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
export class UserModule { }
