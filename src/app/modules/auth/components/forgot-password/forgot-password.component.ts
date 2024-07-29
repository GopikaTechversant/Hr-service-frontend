import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrServices } from 'src/app/services/toastr.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  passwordForm!: UntypedFormGroup;
  otpSent: boolean = false;
  hide: boolean = true;
  toggleSpinner: boolean = false;

  constructor(
    private tostr: ToastrServices,
    private formBuilder: UntypedFormBuilder,
    private http: HttpClient,
    public auth: AuthService,
    private apiService: ApiService
  ) {
    this.passwordForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      otp: [null, [Validators.required]],
      userPassword: [null, [Validators.required, Validators.minLength(6)]],
      confirmpassword: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.passwordForm.get('otp')?.disable();
    this.passwordForm.get('userPassword')?.disable();
    this.passwordForm.get('confirmpassword')?.disable();
  }

  sendOtp(): void {
    const email = this.passwordForm.get('email')?.value;
    this.apiService.post(`/user/forgotPassword`, { userName : email }).subscribe(
      (response: any) => {
        if (response?.token) {
          this.otpSent = true;
          this.passwordForm.get('otp')?.enable();
          this.passwordForm.get('userPassword')?.enable();
          this.passwordForm.get('confirmpassword')?.enable();
          this.tostr.success('OTP sent to your email');
        }
      },
      (error) => {
        if (error?.status === 500) {
          this.tostr.error("Internal Server Error");
        } else {
          this.tostr.error(error?.error?.error_message ? error?.error?.error_message : "Unable to send OTP");
        }
        this.toggleSpinner = false;
      }
    );
  }

  submitNewPassword(): void {
    if (this.passwordForm.valid) {
      const formDetails = this.passwordForm.value;
      if (formDetails.userPassword !== formDetails.confirmpassword) {
        this.tostr.error('Passwords do not match');
        return;
      }

      let payload = {
        otp: formDetails.otp,
        password: formDetails.userPassword,
        confirmPassword: formDetails.confirmpassword
      };

      this.apiService.post(`/user/resetPassword`, payload).subscribe(
        (response: any) => {
          if (response?.token) {
            this.passwordForm.reset();
            this.tostr.success('Password updated successfully');
          }
        },
        (error) => {
          if (error?.status === 500) {
            this.tostr.error("Internal Server Error");
          } else {
            this.tostr.error(error?.error?.error_message ? error?.error?.error_message : "Unable to reset password");
          }
          this.toggleSpinner = false;
        }
      );
    }
  }
}
