import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environments';
import { DatePipe } from '@angular/common';
import { FeedbackComponent } from 'src/app/components/feedback/feedback.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-hr-sidebar',
  templateUrl: './hr-sidebar.component.html',
  styleUrls: ['./hr-sidebar.component.css'],
  providers: [DatePipe],
})
export class HrSidebarComponent implements OnInit {
  @Input() selectedItem: any;
  showRequest: boolean = false;
  showcandidates: boolean = false;
  showProgress: boolean = true;
  candidateId: any;
  salary: any;
  displayDate: any;
  descriptionValue: any;
  showWarning: boolean = false;
  showDescription: boolean = false;
  showbtn: boolean = true;
  serviceId: any;
  selectedCandidatesIds: any;
  candidateServiceId: any;
  constructor(private http: HttpClient, private datePipe: DatePipe, private dialog: MatDialog) {

  }
  ngOnInit(): void {

  }
  dateChange(event: any): void {
    let date = new Date(event?.value);
    this.displayDate = this.datePipe.transform(date, 'yyyy-MM-dd');
  }
  addOffer(): void {
    this.serviceId = this.selectedItem?.serviceId;
    const scoreElement = document.getElementById('salary') as HTMLInputElement;
    this.salary = scoreElement ? scoreElement.value : '';
    const descriptionElement = document.getElementById('description') as HTMLInputElement;
    this.descriptionValue = descriptionElement ? descriptionElement.value : '';

    const payload = {
      offerServiceSeqId: this.serviceId,
      offerSalary: this.salary,
      offerDescription: this.descriptionValue,
      offerJoinDate: this.displayDate
    }
    this.http.post(`${environment.api_url}/hr-station/candidateOffer`, payload).subscribe({
      next: (res: any) => {
        this.showbtn = false;
      },
      error: (error) => {
        console.error('Error adding progress', error);
      }
    })
  }
  onCandidateSelectionChange(event: any, candidate: any, serviceId: any): void {
    let action = event?.target?.value;
    this.candidateServiceId = serviceId;
    const dialogRef = this.dialog.open(FeedbackComponent, {
      data: { candidateId: serviceId, stationId: 4, status: action },
      width: '400px',
      height: '200px'
    })
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        candidate = action;
      }
      let element: any = document.getElementById('status');
      if (element) element.value = candidate;
    })
    dialogRef.componentInstance.selectedCandidatesEmitter.subscribe((selectedCandidatesIds: any[]) => {
      this.selectedCandidatesIds.push(...selectedCandidatesIds);
      console.log("this.selectedCandidatesIds", this.selectedCandidatesIds);

    })
  }
}
