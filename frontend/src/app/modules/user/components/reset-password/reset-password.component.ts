import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  hideNewpassword = true;
  constructor(private fb: FormBuilder, private tostr: ToastrService, private apiService: ApiService) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      userPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      otp: ['']
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: FormGroup) {
    return form.get('userPassword')?.value === form.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  submitClick(): void {
    if (this.passwordForm.valid) {
      const formDetails = this.passwordForm.value;    
      let payload = {
        userCurrentPassword: formDetails.currentPassword,
        userNewPassword: formDetails.userPassword
      };
      this.apiService.post(`/user/changePassword`, payload).subscribe(
        (response: any) => {
          if (response) {
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
        }
      );
    }
  }
}
