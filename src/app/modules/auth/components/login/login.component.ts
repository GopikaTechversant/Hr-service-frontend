import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environments';
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

  constructor(private formBuilder: UntypedFormBuilder, private router: Router, private http: HttpClient, public auth: AuthService,) {
    this.loginForm = this.formBuilder.group({
      userName: [null, [Validators.required]],
      userPassword: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {

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
            console.log('login successfully:', response);
            localStorage.setItem('userToken', response?.token);
            localStorage.setItem('userRole', response?.user?.userRole);
            localStorage.setItem('userId', response?.user?.userId);
            this.router.navigate(['/dashboard']);
          }
        },
        (error) => {
          console.error('Error during login:', error);
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

}
