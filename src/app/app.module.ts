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
import { RequirementEditComponent } from './components/requirement-edit/requirement-edit.component';
import { RequirementDeleteComponent } from './components/requirement-delete/requirement-delete.component';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environments';

@NgModule({
  declarations: [
    AppComponent,
    FeedbackComponent,
    DeleteComponent,
    EditComponent,
    LogoutModalComponent,
    StationSwitchComponent,
    WarningBoxComponent,
    RequirementEditComponent,
    RequirementDeleteComponent,
  
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
      timeOut: 2000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    }),],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.client_id),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
