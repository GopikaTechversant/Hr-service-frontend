import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DatePipe],
  host: {
    '(document:click)': 'onBodyClick($event)'
  },
})
export class DashboardComponent implements OnInit {
  @Output() positionIdChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() startDateChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() endDateChange: EventEmitter<any> = new EventEmitter<any>();

  candidates: any;
  lists: any[] = [];
  requestList: any;
  requestList_open: boolean = false;
  displayPosition: string = '';
  positionId: string = '';
  initialLoader: boolean = false;
  today: Date = new Date();
  // startDate: string | null = this.datePipe.transform(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  startDate: string | null = this.datePipe.transform(new Date(Date.now() - 31 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  endDate: string | null = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  requisitionSearchValue : string = '';
  requsitionSuggestions: any[]=[];
  searchvalue: string = "";
  selectedRequsition:string = '';
  constructor(private apiService: ApiService, public router: Router, private tostr: ToastrService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.initialLoader = true;
    const position = sessionStorage.getItem(`requirement`);
    if (position) {
      let requirement = JSON.parse(position);
      if (requirement) {
        this.requisitionSearchValue = requirement?.name;
        this.positionId = requirement?.id;
      }
    } else {
      this.displayPosition = '';
      this.positionId = '';
    }
    this.fetchcount();
    this.fetchRequirements();
  }
  

  onBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.no-close')) {
      this.requestList_open = false;
    }
  }

  dateChange(event: any, range: string): void {
    let date = new Date(event?.value);
    if (range == 'startDate') this.startDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    if (range == 'endDate') this.endDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.startDateChange.emit(this.startDate);
    this.endDateChange.emit(this.endDate);
    this.fetchcount();
  }

  fetchcount(): void {
    console.log("inside fetch ");
    this.apiService.get(`/dashboard/card-data?requestId=${this.positionId}&fromDate=${this.startDate}&todate=${this.endDate}`)
      .subscribe({
        next: (res: any) => {
          if (res?.data) {
            this.lists = res?.data;
            this.initialLoader = false; 
            console.log("this.lists",this.lists);
            
          }
        },
        error: (err: any) => {
          this.initialLoader = false; 
        }
      });
  }
  
  fetchRequirements(): void {
    this.apiService.get(`/service-request/list`).subscribe((res: any) => {
      if (res?.data) {
        this.requestList = res?.data;
      }
    })
  }

  getRequsitionSuggestion(event:any){
    this.requestList_open = true;
    this.requisitionSearchValue = event?.target.value;
    this.apiService.get(`/service-request/list?search=${this.requisitionSearchValue}`).subscribe((res: any) => {
      if (res?.data) this.requsitionSuggestions = res?.data.filter((suggestion: any) =>
        suggestion.requestName.toLowerCase().startsWith(this.searchvalue.toLowerCase())
      );
    });
  }


  navigateToDetail(position: any): void {
    const foundRequest = this.requestList.find((item: { requestName: any; }) => item.requestName === position);
    if (this.positionId) {
      const id = this.positionId;
      this.router.navigateByUrl(`/dashboard/requisition-detail/${id}`);
    } else this.tostr.warning('No matching position found for navigation');
  }


  selectPosition(name: string, id: string): void {
    this.requestList_open = false;
    this.displayPosition = name; 
    this.positionId = id;
    this.requisitionSearchValue = name; 
    sessionStorage.setItem(`requirement`, JSON.stringify({ name: this.displayPosition, id: this.positionId }));
    this.positionIdChange.emit(this.positionId);
    this.fetchcount(); 
  }
  

  // clearFilter(): void {
  //   this.selectPosition('', '');
  // }
  clearFilter(): void {
    this.displayPosition = '';
    this.positionId = '';
    this.requisitionSearchValue = '';
    this.selectedRequsition = '';
    this.requestList_open = false;
    this.searchvalue = '';
    sessionStorage.removeItem('requirement'); 
    this.positionIdChange.emit(this.positionId);
    this.fetchcount(); 
  }

}
