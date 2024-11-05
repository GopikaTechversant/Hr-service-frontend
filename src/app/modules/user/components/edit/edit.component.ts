import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastrServices } from 'src/app/services/toastr.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [DatePipe],
})
export class EditComponent implements OnInit {
  public onEditSuccess: EventEmitter<void> = new EventEmitter<void>();
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
  candidateDetails: any = {};
  originalUser: any[] = [];
  dob: any;
  workStation: any;
  constructor(private datePipe: DatePipe, private apiService: ApiService, private tostr: ToastrServices, public dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }
  ngOnInit(): void {
    this.fetchUserDetails();
    this.fetchStations();
  }
  fetchUserDetails(): void {
    this.apiService.get(`/user/reqUsersList/${this.data}`).subscribe((res: any) => {
      this.candidateDetails = res?.data;
      this.populateFieldvalues();
    })
  }
  populateFieldvalues(): void {
    this.firstName = this.candidateDetails?.userfirstName;
    this.lastName = this.candidateDetails?.userlastName;
    this.displayDate = this.datePipe.transform(this.candidateDetails?.userDOB, 'yyyy-MM-dd');
    this.email = this.candidateDetails?.userEmail;
    this.role = this.candidateDetails?.userRole;
    this.workStation = this.candidateDetails?.station;
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
    // this.multipleRole = (document.getElementById('multiplerole') as HTMLInputElement)?.value.split(',');
    const payload: any = {};
    if (this.firstName !== this.candidateDetails?.userfirstName) payload.userfirstName = this.firstName;
    if (this.lastName !== this.candidateDetails?.userlastName) payload.userlastName = this.lastName;
    if (this.email !== this.candidateDetails?.userEmail) payload.userEmail = this.email;
    if (this.displayDate !== this.datePipe.transform(this.candidateDetails?.userDOB, 'yyyy-MM-dd')) payload.userDOB = this.displayDate;
    if (this.role !== this.candidateDetails?.userRole) payload.userRole = this.role;
    if (this.selectedStationId) {
      if (this.selectedStationId !== this.candidateDetails?.userWorkStation) payload.userWorkStation = this.selectedStationId;
    }
    if (Object.keys(payload).length > 0) {
      this.apiService.put(`/user/update/?userId=${this.data}`, payload).subscribe(
        (res: any) => {
          this.tostr.success('User Updated');
          this.dialogRef.close();
          this.onEditSuccess.emit();
        },
        (error: any) => {
          const errorMessage = error.error?.message || 'An error occurred while updating the user.';
          this.tostr.error(errorMessage);
        }
      );
    } else {
      this.dialogRef.close();
      this.tostr.warning('No Change for update');
    }
    
  }

  cancel(): void {
    this.dialogRef.close();
  }

  dateChange(event: any): void {
    let date = new Date(event?.value);
    this.displayDate = this.datePipe.transform(date, 'yyyy-MM-dd');
  }

}
