import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastrServices } from 'src/app/services/toastr.service';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
  host: {
    '(document:click)': 'onBodyClick($event)'
  },
  providers: [DatePipe],
})
export class AddUserComponent implements OnInit {

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
  constructor(private datePipe: DatePipe, private apiService: ApiService, private tostr: ToastrServices) {
  }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.idListOpen = false;
    }
  }
  ngOnInit(): void { }

  fetchStations(): void {
    this.apiService.get(`/user/stations`).subscribe((res: any) => {
      this.stationList = res?.data;
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
    //  this.multipleRole = (document.getElementById('multiplerole') as HTMLInputElement)?.value.split(',');
    const payload = {
      userfirstName: this.firstName,
      userlastName: this.lastName,
      userEmail: this.email,
      userDOB: this.displayDate,
      userPassword: this.password,
      userWorkStation: this.selectedStationId,
      userRole: this.role,
      // userMultipleRole: this.multipleRole
    }
    this.apiService.post(`/user/create`, payload).subscribe((res: any) => {
      this.tostr.success('User Created');
    })
    // this.resetForm();
  }

  cancel(): void {
    // this.resetForm();
  }

  dateChange(event: any): void {
    let date = new Date(event?.value);
    this.displayDate = this.datePipe.transform(date, 'yyyy-MM-dd');
  }
}
