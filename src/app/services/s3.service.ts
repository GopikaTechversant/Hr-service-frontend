import { Injectable } from "@angular/core";
import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";

@Injectable({
  providedIn: 'root'
})
export class S3Service {
  private s3Client: S3Client;

  constructor() {
    // Initialize AWS S3 client
    this.s3Client = new S3Client({
      region: 'your-region', // Specify your AWS region
      credentials: {
        accessKeyId: 'your-access-key-id', // Specify your AWS access key ID
        secretAccessKey: 'your-secret-access-key' // Specify your AWS secret access key
      }
    });
  }

  async uploadImage(file: File, bucketName: string, key: string): Promise<any> {
    const params: PutObjectCommandInput = {
      Bucket: bucketName,
      Key: key,
      Body: file,
      ACL: 'public-read' // Set ACL to make the uploaded image publicly accessible
    };
    const command = new PutObjectCommand(params);
    return await this.s3Client.send(command);
  }
}
