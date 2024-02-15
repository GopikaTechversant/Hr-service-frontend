import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environments';
import { ToastrServices } from 'src/app/services/toastr.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: UntypedFormGroup;
  toggleSpinner: boolean = false;
  submitted: boolean = false;
  hide: boolean = true;

  constructor(private tostr: ToastrServices, private formBuilder: UntypedFormBuilder, private router: Router, private http: HttpClient, public auth: AuthService,) {
    this.loginForm = this.formBuilder.group({
      userName: [null, [Validators.required]],
      userPassword: [null, [Validators.required]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    this.checkRememberMe();
  }

  checkRememberMe() {
    const remembered = JSON.parse(localStorage.getItem('rememberMe') || 'false');
    if (remembered) {
      const userName = localStorage.getItem('userName');
      const userPassword = localStorage.getItem('userPassword');
      this.loginForm.patchValue({
        userName: userName,
        userPassword: userPassword,
        rememberMe: true
      });
    }
  }

  get userName() {
    return this.loginForm.get("userName");
  }

  get userPassword() {
    return this.loginForm.get("userPassword");
  }

  loginApi() {
    if (this.loginForm.value.userPassword && this.loginForm.value.userName) {
      this.http.post(`${environment.api_url}/user/login`, this.loginForm.value).subscribe(
        (response: any) => {
          if (response?.token) {
            localStorage.setItem('userToken', response?.token);
            localStorage.setItem('userRole', response?.user?.userRole);
            localStorage.setItem('userId', response?.user?.userId);
            this.router.navigate(['/dashboard']);
            this.tostr.success('Login Successfully');
          }
        },
        (error) => {
          if (error?.status === 500) this.tostr.error("Internal Server Error")
          else {
            this.tostr.error(error?.error?.error_message ? error?.error?.error_message : "Unable to Login");
          }
          this.toggleSpinner = false;
          this.submitted = false;
          if (error.status === 401) {
            this.loginForm.setErrors({ invalidCredentials: true });
          }
        }
      );
    } else {
      this.toggleSpinner = false;
    }
  }

  submitClick() {
    this.toggleSpinner = true;
    this.submitted = true;
    this.loginApi();
  }

  forgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

}
