import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './modules/auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { FormsModule } from '@angular/forms';
import { DeleteComponent } from './components/delete/delete.component';
import { EditComponent } from './components/edit/edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './modules/material/material.module';
import { LogoutModalComponent } from './components/logout-modal/logout-modal.component';
import { StationSwitchComponent } from './components/station-switch/station-switch.component';
import { WarningBoxComponent } from './components/warning-box/warning-box.component';
import { FileUploadS3Component } from './components/file-upload-s3/file-upload-s3.component';

@NgModule({
  declarations: [
    AppComponent,
    FeedbackComponent,
    DeleteComponent,
    EditComponent,
    LogoutModalComponent,
    StationSwitchComponent,
    WarningBoxComponent,
    FileUploadS3Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, 
    MaterialModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    }),],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
