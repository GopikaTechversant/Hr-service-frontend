import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  @ViewChild('name') name!: ElementRef<HTMLInputElement>;
  @ViewChild('email') email!: ElementRef<HTMLInputElement>;
  @ViewChild('password') password!: ElementRef<HTMLInputElement>;
  @ViewChild('confirm') confirm!: ElementRef<HTMLInputElement>;
  @ViewChild('role') role!: ElementRef<HTMLInputElement>;
  hide: boolean = true;
  constructor() {

  }
  ngOnInit(): void {

  }
  clearInputValue(inputElement: ElementRef<HTMLInputElement>) {
    inputElement.nativeElement.value = '';
  }
  resetForm(): void {
    this.clearInputValue(this.name);
    this.clearInputValue(this.email);
    this.clearInputValue(this.password);
    this.clearInputValue(this.password);
    this.clearInputValue(this.confirm);
    this.clearInputValue(this.role);
  }
  submitClick(): void {
    this.resetForm();
  }
  cancel(): void {
    this.resetForm();
  }
}
