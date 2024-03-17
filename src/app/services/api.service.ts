import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const authToken = localStorage.getItem('userToken');
    let headers = new HttpHeaders().set('', '');
    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    }
    return headers;
  }

  // Generic GET method
  get(url: string): Observable<any> {
    return this.http.get(`${environment.api_url}${url}`, { headers: this.getHeaders() });
  }

  // Generic POST method
  post(url: string, data: any): Observable<any> {
    return this.http.post(`${environment.api_url}${url}`, data, { headers: this.getHeaders() });
  }

  // Generic PUT method
  update(url: string, data: any): Observable<any> {
    return this.http.put(`${environment.api_url}${url}`, data, { headers: this.getHeaders() });
  }

  // Generic DELETE method
  delete(url: string): Observable<any> {
    return this.http.delete(`${environment.api_url}${url}`, { headers: this.getHeaders() });
  }
}
