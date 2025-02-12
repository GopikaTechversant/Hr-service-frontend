import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit{
  @Input() totalCount: any; 
  @Input() pageSize = 13;  
  @Input() lastPage:any;  
  @Input() currentPage: number = 1;
  @Output() pageChange = new EventEmitter<number>();
  constructor(){}
  ngOnInit(): void {
  }
  onPageChange(pageNumber: number): void {
    this.currentPage = Math.max(1, pageNumber);
    this.pageSize = 13;
    this.pageChange.emit(pageNumber);
    // this.fetchCandidates();
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
