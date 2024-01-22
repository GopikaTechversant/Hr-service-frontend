import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApprovalStatusService {

  constructor() { }
  private approvalstatusSubject = new BehaviorSubject<boolean>(false);
  approvalStatus = this.approvalstatusSubject.asObservable();
  updateapprovalStatus(status:boolean){
    this.approvalstatusSubject.next(status);
  }
}
