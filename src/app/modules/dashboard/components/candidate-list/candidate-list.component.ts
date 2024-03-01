import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from 'src/app/components/delete/delete.component';
import { EditComponent } from 'src/app/components/edit/edit.component';
@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css']
})
export class CandidateListComponent {
  @Input() appCustomLength: number = 0;

  length: any = 20;
  pageSize = 10;
  pageIndex = 1;
  pageSizeOptions = [10, 25, 30];
  showFirstLastButtons = true;
  candidateList: any;
  searchWord: string = '';
  searchQuery: any = {
    searchWord: '',
    page: 1,
    limit: 25,
  };
  currentPag: number = 1;
  currentLimit: number = 7;
  totalCount: any;
  data: any;
  candidateId: any;
  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog) { }
  ngOnInit(): void {
    this.fetchCandidates('');
  }

  fetchCandidates(searchKey: string): void {
    this.searchQuery.searchWord = searchKey;
    this.http.get(`${environment.api_url}/candidate/list?search=${this.searchQuery.searchWord}&page=${this.pageIndex}&limit=${this.pageSize}`)
      .subscribe((data: any) => {
        this.data = data;
        this.candidateList = [];
        this.candidateList = data?.candidates;
        this.totalCount = data?.candidateCount;

        console.log("candidate id", this.data);

      });
  }
  navigate(path: any, queryParam: any): void {
    if (queryParam) this.router.navigate([path], { queryParams: { type: queryParam } });
    else this.router.navigate([path]);
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, false);
  }

  pageChange(event: any): void {
    let skip = parseInt(event, 10);
    this.currentPag = skip;
  }
  handlePageEvent(event: any) {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchCandidates('');
  }
  delete(id: any): void {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: id,
      width: '350px',
      height: '150px'
    })
    dialogRef.componentInstance.onDeleteSuccess.subscribe(() => {
      this.fetchCandidates('');
    })
  }
  edit(id: any): void {
    const dialogRef = this.dialog.open(EditComponent, {
      data: id,
      width: '900px',
      height: '600px'
    })
  }

}
