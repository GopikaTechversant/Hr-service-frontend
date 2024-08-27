import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-station-candidates',
  templateUrl: './station-candidates.component.html',
  styleUrls: ['./station-candidates.component.css']
})
export class StationCandidatesComponent implements OnInit {
  @Input() candidateList: any;
  @Input() displayPosition: string = '';
  @Input() filteredStatus: string = '';
  @Input() currentPage : number = 1;
  @Input() lastPage: any;
  @Output() search: EventEmitter<string> = new EventEmitter<string>();
  @Output() experienceSearch: EventEmitter<string> = new EventEmitter<string>();
  @Output() positionData: EventEmitter<{ name: string, id: any }> = new EventEmitter<{ name: string, id: any }>();
  @Output() statusData: EventEmitter<string> = new EventEmitter<string>();
  @Output() dateChangeEvent: EventEmitter<{ event: any, range: string }> = new EventEmitter();
  @Output() exportClicked: EventEmitter<boolean> = new EventEmitter();
  @Output() switchStation = new EventEmitter<any>();
  @Output() viewDetails: EventEmitter<{ id: any, status: any }> = new EventEmitter<{ id: any, status: any }>();
  @Output() pageNumber: EventEmitter<number> = new EventEmitter<number>();
  startDate: string | null = this.datePipe.transform(new Date(Date.now() - 150 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  endDate: string | null = this.datePipe.transform(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  searchKeyword: string = '';
  experience: string = '';
  initialLoader: boolean = false;
  loader: boolean = false;
  status: any[] = [];
  isExport: boolean = false;
  requestList: any;
  requestList_open: any;
  filterStatus: any;
  positionId: any;
  stationsList: any;
  stationId : any;
  url: any;
  currentStation : string = '';
  today: Date = new Date();
  @Output() filterCleared: EventEmitter<any> = new EventEmitter<any>();
  constructor(private apiService: ApiService, private datePipe: DatePipe , private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.currentStation = this.router.url.split('/')[1];
    this.route.params.subscribe(params => {
      this.stationId = params['id'];
      this.url = `/technical/${this.stationId}`;
    });
    this.fetchRequirements();
    this.fetchStatus();
  }

  fetchStatus(): void {
    this.apiService.get(`/user/filter-status`).subscribe(res => {
      this.status = res?.data;
    });
  }

  fetchRequirements(): void {
    this.apiService.get(`/service-request/list`).subscribe((res: any) => {
      if (res?.data) {
        this.requestList = res?.data;
      }
    })
  }

  searchCandidate(keyword: string): void {
    this.search.emit(keyword);
  }

  position(name: string, id: any): void {
    this.requestList_open = false;
    this.positionData.emit({ name, id });
  }

  searchByExperience(exp: any): void {
    this.experienceSearch.emit(exp);
  }

  selectStatusFilter(status: any): void {
    this.filterStatus = false;
    this.statusData.emit(status);
  }

  clearFilter(item: any): void {
    this.filterCleared.emit(item);
  }

  experienceValidation(event: any): void {
    const intermediateAllowedCharacters = /^-?(\d{0,1}\d?)?(\.\d{0,2})?$/;
    let enteredValue = event?.target?.value + event.key;
    if (event.key === "Backspace" || event.key === "Delete" || event.key.includes("Arrow")) return;
    if (!intermediateAllowedCharacters.test(enteredValue)) event.preventDefault();
  }

  dateChange(event: any, range: string): void {
    this.dateChangeEvent.emit({ event, range });
  }

  exportData(): void {
    this.exportClicked.emit(true);
  }

  onSwitchStation(item:any):void{
    this.switchStation.emit(item);
  }

  fetchDetails(id: any, status: any): void {
    this.viewDetails.emit({ id, status });
  }
  onPageChange(pageNumber: number): void {
    this.pageNumber.emit(pageNumber)
    
  }
  
  generatePageNumbers() {
    let pages = [];
    if (this.lastPage <= 5) {
      for (let i = 1; i <= this.lastPage; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, this.currentPage - 1);
      let end = Math.min(this.lastPage - 1, this.currentPage + 1);
      if (this.currentPage <= 3) end = 4;
      else if (this.currentPage >= this.lastPage - 2) start = this.lastPage - 3;
      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < this.lastPage - 1) pages.push('...');
      pages.push(this.lastPage);
    }
    return pages;
  }
}
