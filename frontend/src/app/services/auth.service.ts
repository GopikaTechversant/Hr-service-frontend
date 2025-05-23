import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  isAuthenticated() {
    let token = localStorage.getItem('userToken');
    if (token === null) return false;
    else {
      // let decodedToken: any = jwtDecode(token);
      return true;
    }
  }

  getUser() {
    let token = localStorage.getItem('userToken');
    if (token === null) return false;
    else return token;
  }


}
