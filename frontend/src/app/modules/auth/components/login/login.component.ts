import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrServices } from 'src/app/services/toastr.service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environments';

declare const google: any;

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
  env_url: any;
  gmailLogin: boolean = false;

  constructor(private tostr: ToastrServices, private formBuilder: UntypedFormBuilder, private router: Router, private apiService: ApiService, public auth: AuthService) {
    this.loginForm = this.formBuilder.group({
      userName: [null, [Validators.required]],
      userPassword: [null, [Validators.required]],
      // rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // this.checkRememberMe();
    this.env_url = window.location.origin;
    // this.initializeGoogleSignIn();
  }

  // checkRememberMe() {
  //   const remembered = JSON.parse(localStorage.getItem('rememberMe') || 'false');
  //   if (remembered) {
  //     const userName = localStorage.getItem('userName');
  //     const userPassword = localStorage.getItem('userPassword');
  //     this.loginForm.patchValue({
  //       userName: userName,
  //       userPassword: userPassword,
  //       // rememberMe: true
  //     });
  //   }
  // }

  get userName() {
    return this.loginForm.get("userName");
  }

  get userPassword() {
    return this.loginForm.get("userPassword");
  }

  loginApi() {
    if (this.loginForm.value.userPassword && this.loginForm.value.userName) {
      this.apiService.post(`/user/login`, this.loginForm.value).subscribe(
        (response: any) => {
          if (response?.token) {
            // Store user data in localStorage
            localStorage.setItem('userToken', response?.token);
            localStorage.setItem('userRole', response?.user?.userRole);
            localStorage.setItem('userFullName', response?.user?.userFullName);
            localStorage.setItem('userId', response?.user?.userId);
            localStorage.setItem('userType', response?.user?.userType);
  
            this.toggleSpinner = false;
  
            if(response?.user?.userRole != 'panel'){
              // Navigate to dashboard
            this.router.navigate(['/dashboard']).then(() => {
              // Show toaster after navigation is complete
              this.tostr.success('Logged In Successfully!');
            });
            }
            else{
              this.router.navigate([`/technical/2`]).then(() => {
                // Show toaster after navigation is complete
                this.tostr.success('Logged In Successfully!');
              });
            }
          }
        },
        (error) => {
          if (error?.status === 500) this.tostr.error("Internal Server Error")
          else {
            this.tostr.error(error?.error?.error_message ? error?.error?.error_message : "Invalid user credentials");
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

  initializeGoogleSignIn(): void {
    google.accounts.id.initialize({
      client_id: environment.client_id,
      callback: this.handleGoogleResponse.bind(this)
    });
    this.renderGoogleButton();   
    // Optionally, you can listen for window resize events to adjust the button size dynamically
    window.addEventListener('resize', () => this.renderGoogleButton());
  }
  
  renderGoogleButton(): void {
    let buttonWidth = '600';
    
    if (window.innerWidth < 1300) {
      buttonWidth = '350';
    } 
    if (window.innerWidth < 768) {
      buttonWidth = '200';
    } 
    if (window.innerWidth < 480) {
      buttonWidth = '250';
    }
    
    google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      {
        theme: 'outline',
        size: 'large',
        text: 'Sign In With',
        shape: 'rectangular',
        width: buttonWidth,
      }
    );
  }

  handleGoogleResponse(response: any): void {
    // console.log(response);
    // const decodedToken: any = jwtDecode(response.credential);
    // const email = decodedToken.email;
    // console.log(`User's email: ${email}`);
    this.toggleSpinner = true;
    if (response?.credential) {
      this.apiService.post(`/user/login`, { gmail: response?.credential }).subscribe(
        (response: any) => {
          if (response?.token) {
            this.tostr.success('Login Successfully');
            localStorage.setItem('userToken', response?.token);
            localStorage.setItem('userRole', response?.user?.userRole);
            localStorage.setItem('userFullName', response?.user?.userFullName);
            localStorage.setItem('userId', response?.user?.userId);
            this.router.navigate(['/dashboard']);
          }
        },
        (error) => {
          if (error?.status === 500) {
            this.tostr.error("Internal Server Error");
          } else if (error?.status === 401) {
            this.tostr.error("No User Found");
            this.gmailLogin = true;
          } else {
            this.tostr.error("Unable to Login");
          }
          this.toggleSpinner = false;
          this.submitted = false;
        }
      );
    }
  }

}
