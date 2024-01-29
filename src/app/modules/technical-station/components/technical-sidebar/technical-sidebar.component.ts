import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-technical-sidebar',
  templateUrl: './technical-sidebar.component.html',
  styleUrls: ['./technical-sidebar.component.css']
})
export class TechnicalSidebarComponent {
@Input() selectedItem: any
showRequest: boolean = false;
showcandidates: boolean = false;

ngOnChanges(changes: SimpleChanges): void {
  
}
}
