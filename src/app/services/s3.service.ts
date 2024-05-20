import { EventEmitter, Injectable, Output } from "@angular/core";
import { S3Client, PutObjectCommand, PutObjectCommandInput, GetObjectCommand, S3 } from "@aws-sdk/client-s3";
import { environment } from "src/environments/environments";
import { ApiService } from "./api.service";
@Injectable({
  providedIn: 'root'
})
export class S3Service {
  private s3Client: S3Client;
  uploadedFile = new EventEmitter<any>();
 
  @Output() key = new EventEmitter<any>();
  constructor(private apiService: ApiService) {
    this.fetchBucketName();
    console.log("uploadedFile >>", this.uploadedFile);
    // Initialize AWS S3 client
    this.s3Client = new S3Client({
      region: 'us-east-2', // Specify your AWS region
      credentials: {
        accessKeyId: environment.accessKeyId, // Specify your AWS access key ID
        secretAccessKey: environment.secretKey // Specify your AWS secret access key
      }
    });
  }

  fetchBucketName(): void {
    this.apiService.get(`/user/s3-credential`).subscribe((res: any) => {
      console.log("res", res);
    })
  }

  async uploadImage(file: File, bucketName: string, fileType: any): Promise<any> {
    const mimeType = file.type;
    console.log("mimeType",mimeType);
    
    const fileExtension = file.name.split('.').pop(); // Get the file extension
    const fileNameWithoutExtension = fileType.name.split('.').slice(0, -1).join('.');
    const currentDate = new Date().toISOString().split('T')[0]; // Get the current date
    const key = `${fileNameWithoutExtension}.${fileExtension}`;
    console.log("key",this.key);
    const params: PutObjectCommandInput = {
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentEncoding: 'base64',
      ContentDisposition: 'inline',
      ContentType: mimeType,
      // ContentType: 'application/octet-stream'
      // ACL: 'public-read' // Set ACL to make the uploaded image publicly accessible
    };
    console.log("params",params);
    
    const command = new PutObjectCommand(params);
    console.log("command",command);
    
    // return await this.s3Client.send(command);
    const result = await this.s3Client.send(command);
    this.key.emit(key); // Emit the key
    return result;
  }
}
