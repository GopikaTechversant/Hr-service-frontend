import { Component, OnInit } from '@angular/core';
import { S3Service } from 'src/app/services/s3.service';
@Component({
  selector: 'app-file-upload-s3',
  templateUrl: './file-upload-s3.component.html',
  styleUrls: ['./file-upload-s3.component.css']
})
export class FileUploadS3Component implements OnInit{
  selectedFile: File | null = null;
  constructor(private s3Service: S3Service){}
  ngOnInit(): void {
    
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

}
