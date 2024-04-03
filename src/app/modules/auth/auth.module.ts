import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';


const routes: Routes = [
  { path: '', component: LoginComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
]
@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    
   
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    
    
  ]
})
export class AuthModule { }
