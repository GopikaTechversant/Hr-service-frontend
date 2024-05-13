import { EventEmitter, Injectable } from "@angular/core";
import { S3Client, PutObjectCommand, PutObjectCommandInput, GetObjectCommand, S3 } from "@aws-sdk/client-s3";
import { environment } from "src/environments/environments";
@Injectable({
  providedIn: 'root'
})
export class S3Service {
  private s3Client: S3Client;
  uploadedFile = new EventEmitter<any>();
  constructor() {
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

  async uploadImage(file: File, bucketName: string, key: string): Promise<any> {
    console.log("uploadedFile", this.uploadedFile);
    const params: PutObjectCommandInput = {
      Bucket: bucketName,
      Key: key,
      Body: file,
      // ACL: 'public-read' // Set ACL to make the uploaded image publicly accessible
    };
    const command = new PutObjectCommand(params);
    console.log("command", command);
    return await this.s3Client.send(command);
    console.log("uploadedFile", this.uploadedFile);
  }
}
