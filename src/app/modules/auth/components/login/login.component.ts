import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
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
      email: [null, [Validators.required]],
      password: [null, [Validators.required],
      ],
    });
  }
  ngOnInit(): void {

  }
  get email() {
    return this.loginForm.get("email");
  }

  get password() {
    return this.loginForm.get("password");
  }

  loginApi() {
    if (this.loginForm.value.password && this.loginForm.value.email) {
      this.http.get('/assets/user.json').subscribe((data: any) => {
        console.log("data", data);
        data?.forEach((element: any) => {
          if (element?.user?.userEmail === this.loginForm.value.email) {
            console.log("eucyfucfuc");
            localStorage.setItem('userToken', element?.token);
            this.auth.isAuthenticated();
          }
        })
      })
    }
  }

  submitClick() {
    this.toggleSpinner = true;
    this.submitted = true;
    console.log("submit click");
    this.loginApi();
    this.router.navigate(['/dashboard']);
    this.toggleSpinner = false;
  }
}
