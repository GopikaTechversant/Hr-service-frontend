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
  hide2: boolean = true;
  displayDate: any;
  passwordsMatch: boolean = true;
  stationList: any[] = [];
  idListOpen: boolean = false;
  selectedStation: string = '';
  selectedStationId: string = '';
  password: any;
  firstName: string = '';
  lastName: string = '';
  role: string = '';
  multipleRole: any[] = [];
  email: any;
  openUserList: boolean = false;
  constructor(private datePipe: DatePipe, private apiService: ApiService, private tostr: ToastrServices) {
  }

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.idListOpen = false;
      this.openUserList = false;
    }
  }
  ngOnInit(): void {
    this.fetchStations();
  }

  fetchStations(): void {
    this.apiService.get(`/user/stations`).subscribe((res: any) => {
      this.stationList = res?.data;
    })
  }

  selectRole(item: any): void {
    this.role = item;
  }

  selectStation(stationid: any, stationName: any): void {
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
    const payload = {
      userfirstName: this.firstName,
      userlastName: this.lastName,
      userEmail: this.email,
      userDOB: this.displayDate,
      userPassword: this.password,
      userWorkStation: this.selectedStationId,
      userRole: this.role,
    }
    this.apiService.post(`/user/create`, payload).subscribe((res: any) => {
      this.resetFormAndState();
      this.tostr.success('User Created');
    },
      (error) => {
        if (error?.status === 500) {
          this.tostr.error("Internal Server Error");
        } else {
          this.tostr.error(error?.error?.error_message ? error?.error?.error_message : "Unable to create User");
        }
      }
    );
    // this.resetForm();
  }

  cancel(): void {
    this.resetFormAndState();
    // this.resetForm();
  }

  dateChange(event: any): void {
    let date = new Date(event?.value);
    this.displayDate = this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  resetFormAndState(): void {
    (document.getElementById('firstname') as HTMLInputElement).value = '';
    (document.getElementById('secondName') as HTMLInputElement).value = '';
    (document.getElementById('email') as HTMLInputElement).value = '';
    (document.getElementById('password') as HTMLInputElement).value = '';
    (document.getElementById('conformPassword') as HTMLInputElement).value = '';
    this.selectedStation = '';
    this.role = '';
    this.displayDate = '';
  }
}
