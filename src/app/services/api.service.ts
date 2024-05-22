import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  authToken: any;
  constructor(private http: HttpClient) { }

  getToken() {
    if (this.authToken) return this.authToken;
    else {
      let token = localStorage.getItem('userToken');
      if (token === null) return '';
      else return token;
    }
  }

  get(url: string): Observable<any> {
    return this.http.get(`${environment.api_url}${url}`);
  }

  // Generic POST method
  post(url: string, data: any): Observable<any> {
    return this.http.post(`${environment.api_url}${url}`, data);
  }

  // Generic PUT method
  update(url: string, data: any): Observable<any> {
    return this.http.put(`${environment.api_url}${url}`, data);
  }

  // Generic DELETE method
  delete(url: string): Observable<any> {
    return this.http.delete(`${environment.api_url}${url}`);
  }

  // private getHeaders(): HttpHeaders {
  //   const authToken = localStorage.getItem('userToken');
  //   let headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
  //   if (authToken) {
  //     headers = headers.set('Authorization', `Bearer ${authToken}`);
  //   }
  //   return headers;
  // }

  // // Generic GET method
  // get(url: string): Observable<any> {
  //   return this.http.get(`${environment.api_url}${url}`, { headers: this.getHeaders() });
  // }

  // // Generic POST method
  // post(url: string, data: any): Observable<any> {
  //   let headers = new HttpHeaders({
  //     'ngrok-skip-browser-warning': environment['ngrok-skip-browser-warning']
  //   });
  //   return this.http.post(`${environment.api_url}${url}`, data,{ headers: headers });
  // }

  // // Generic PUT method
  // update(url: string, data: any): Observable<any> {
  //   return this.http.put(`${environment.api_url}${url}`, data);
  // }

  // // Generic DELETE method
  // delete(url: string): Observable<any> {
  //   return this.http.delete(`${environment.api_url}${url}`);
  // }

  
}








