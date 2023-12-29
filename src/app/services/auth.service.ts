import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  isAuthenticated() {
    let token = localStorage.getItem('userToken');
    if (token === null) return false;
    else {
      let decodedToken: any = jwtDecode(token);
      console.log("decodedToken", decodedToken);
      return true;
    }

  }
  getUser() {
    let token = localStorage.getItem('userToken');
    if (token === null) return false;
    else return jwtDecode(token);
  }

  // storeUserInfo(token: string, userId: string): void {
    
  //   localStorage.setItem('userId', userId);
  // }

}
