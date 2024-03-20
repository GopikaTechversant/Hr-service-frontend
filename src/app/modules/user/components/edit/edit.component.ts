import { DatePipe } from '@angular/common';

import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ToastrServices } from 'src/app/services/toastr.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [DatePipe],
})
export class EditComponent implements OnInit {
  hide: boolean = true;
  displayDate: any;
  passwordsMatch: boolean = true;
  stationList: any[] = [];
  idListOpen: boolean = false;
  selectedStation: string = '';
  selectedStationId: string = '';
  password: any;
  firstName: string = '';
  lastName: string = '';
  role: any;
  multipleRole: any[] = [];
  email: any;
  candidateDetails: any[] = [];
  originalUser:any[]=[];
  constructor(private datePipe: DatePipe, private apiService: ApiService, private tostr: ToastrServices, private http: HttpClient, public dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }
  ngOnInit(): void {
    this.fetchUserDetails();
  }
  fetchUserDetails(): void {
    this.http.get(``).subscribe((res: any) => {
      // this.candidateDetails = 
    })
  }
  fetchStations(): void {
    this.apiService.get(`/user/stations`).subscribe((res: any) => {
      this.stationList = res.data;
    })
  }
  selectStation(stationid: any, stationName: any): void {
    // this.idListOpen = false;
    this.selectedStation = stationName;
    this.selectedStationId = stationid;
  }
  matchPasswordvalidator() {
    this.password = (document.getElementById('password') as HTMLInputElement)?.value;
    const confirmPassword = (document.getElementById('conformPassword') as HTMLInputElement)?.value;
    return this.password === confirmPassword;
  }
  clearInputValue(inputElement: ElementRef<HTMLInputElement>) {
    inputElement.nativeElement.value = '';
  }

  submitClick(): void {
    this.passwordsMatch = this.matchPasswordvalidator();
    if (!this.passwordsMatch) {
      this.tostr.warning('password is not matching');
      return;
    }
    this.firstName = (document.getElementById('firstname') as HTMLInputElement)?.value;
    this.lastName = (document.getElementById('secondName') as HTMLInputElement)?.value;
    this.email = (document.getElementById('email') as HTMLInputElement)?.value;
    this.role = (document.getElementById('role') as HTMLInputElement)?.value;
    this.multipleRole = (document.getElementById('multiplerole') as HTMLInputElement)?.value.split(',');
    const payload = {
      userfirstName: this.firstName,
      userlastName: this.lastName,
      userEmail: this.email,
      userDOB: this.displayDate,
      userPassword: this.password,
      userWorkStation: this.selectedStationId,
      userRole: this.role,
      userMultipleRole: this.multipleRole
    }
  
  }
  cancel(): void {
    this.dialogRef.close();
    // this.resetForm();
  }
  dateChange(event: any): void {
    let date = new Date(event?.value);
    this.displayDate = this.datePipe.transform(date, 'yyyy-MM-dd');
  }

}
