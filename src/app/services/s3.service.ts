import { Injectable } from '@angular/core';
// import * as AWS from 'aws-sdk';
@Injectable({
  providedIn: 'root'
})
export class S3Service {
  // private s3: AWS.S3;

  // constructor() {
  //   // Load AWS configuration from the JSON file
  //   AWS.config.loadFromPath('src/assets/aws-config.json');
  //   this.s3 = new AWS.S3();
  // }

  // uploadImage(file: File, bucketName: string, key: string): Promise<any> {
  //   const params = {
  //     Bucket: bucketName,
  //     Key: key,
  //     Body: file,
  //     ACL: 'public-read' // Set ACL to make the uploaded image publicly accessible
  //   };
  //   return new Promise((resolve, reject) => {
  //     this.s3.upload(params, (err: any, data: any) => {
  //       if (err) reject(err);
  //       else resolve(data);
  //     });
  //   });
  // }
}
