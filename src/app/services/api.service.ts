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

  private createHeaders(): HttpHeaders {
    const token = (localStorage.getItem('userToken') || '').trim();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  }

  getToken() {
    if (this.authToken) return this.authToken;
    else {
      let token = localStorage.getItem('userToken');
      if (token === null) return '';
      else return token;
    }
  }

  // Generic GET method
  get(url: string): Observable<any> {
    return this.http.get(`${environment.api_url}${url}`, { headers: this.createHeaders() });
  }

  // Generic POST method
  post(url: string, data: any): Observable<any> {
    return this.http.post(`${environment.api_url}${url}`, data, { headers: this.createHeaders() });
  }

  // Generic PUT method
  update(url: string, data: any): Observable<any> {
    return this.http.put(`${environment.api_url}${url}`, data, { headers: this.createHeaders() });
  }

  // Generic DELETE method
  delete(url: string): Observable<any> {
    return this.http.delete(`${environment.api_url}${url}`, { headers: this.createHeaders() });
  }

  // Generic PUT method (duplicate, can be removed if not needed)
  put(url: string, data: any): Observable<any> {
    return this.http.put(`${environment.api_url}${url}`, data, { headers: this.createHeaders() });
  }

  // Generic PATCH method
  patch(url: string, data: any): Observable<any> {
    return this.http.patch(`${environment.api_url}${url}`, data, { headers: this.createHeaders() });
  }

  // Method to get templates (e.g., files) with a Blob response
  getTemplate(url: string): Observable<Blob> {
    return this.http.get(`${environment.api_url}${url}`, {
      headers: this.createHeaders(),
      responseType: 'blob'
    });
  }
}
