import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrServices } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  passwordForm!: UntypedFormGroup;
  toggleSpinner: boolean = false;
  submitted: boolean = false;
  hide: boolean = true;
  constructor(private tostr: ToastrServices, private formBuilder: UntypedFormBuilder, private http: HttpClient, public auth: AuthService,) {
    this.passwordForm = this.formBuilder.group({
      email: [null, [Validators.required]],
      userPassword: [null, [Validators.required]],
      confirmpassword: [null, [Validators.required]]
    });
  }
  ngOnInit(): void {

  }
  submitClick():void{
    const formDetails = this.passwordForm.value;
    const formdata = new FormData;
    for (const key in formDetails){
      if(formDetails[key]) formdata.append(key,formDetails[key]);
    }

    this.passwordForm.reset();
    this.tostr.success('Password updated ');
  }
}
