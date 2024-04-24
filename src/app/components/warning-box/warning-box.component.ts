import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { ToastrServices } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-warning-box',
  templateUrl: './warning-box.component.html',
  styleUrls: ['./warning-box.component.css']
})
export class WarningBoxComponent {
  constructor(
    public dialogRef: MatDialogRef<WarningBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,) {
    if (data) {
      this.data = data;
    }
    this.dialogRef.updateSize('25%', '25%');
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
