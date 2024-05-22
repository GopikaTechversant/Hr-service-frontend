import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { S3Service } from 'src/app/services/s3.service';
Subscription
@Component({
  selector: 'app-file-upload-s3',
  templateUrl: './file-upload-s3.component.html',
  styleUrls: ['./file-upload-s3.component.css']
})
export class FileUploadS3Component implements OnInit {
  @Input() selectedFile: any;
  constructor(private s3Service: S3Service) { }
  ngOnInit(): void {
    console.log("dgsydgyadfg", this.selectedFile);
    if (this.selectedFile) this.s3Service.uploadImage(this.selectedFile, 'hr-service-images', 'image');
  }

  ngOnchanges(changes: SimpleChanges) {
    console.log(" this.selectedFile",this.selectedFile);
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
    // this.selectedFile = null;
  }
}



