import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-technical-detail',
  templateUrl: './technical-detail.component.html',
  styleUrls: ['./technical-detail.component.css']
})
export class TechnicalDetailComponent implements OnInit {
  @Output() itemSelected = new EventEmitter<any>();

  candidateList: any = [];
  loader: boolean = false;
  selectedItem: any;

  constructor(private http: HttpClient, private router: Router) { }
  ngOnInit(): void {
    this.fetchList();
  }

  fetchList(): void {
    this.loader = true;
    this.http.get(`${environment.api_url}/technical-station/list`).subscribe((data: any) => {
      this.loader = false;
      if (data.candidates) {
        this.candidateList.push(data.candidates);
        this.selectedItem = this.candidateList[0][0];
        this.itemSelected.emit(this.selectedItem);
      }
    });
  }

  onSelect(item: any): void {
    this.selectedItem = item;
    this.itemSelected.emit(this.selectedItem);
  }

  navigateToDetail(id: any): void {
    this.router.navigate(['/detail'], {
   
    });
  }
}
