import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private pCurrentUser: BehaviorSubject<IUser>;
  get currentUser(): BehaviorSubject<IUser> {
    return this.pCurrentUser;
  }

  constructor(private http: HttpClient) {
      this.pCurrentUser = new BehaviorSubject<IUser>(JSON.parse(localStorage.getItem('user')));
  }

  isLocalTokenValid(): boolean {
    if (this.currentUser.value === null) {
        return false;
    }
    const decoded: any = jwt_decode(this.currentUser.value.access_token);
    const tokenExpiration = decoded.exp * 1000;
    const now = Date.now();
    return tokenExpiration > now;
  }

  login(login: string, senha: string): Observable<IUser> {
      return this.http.post<IUser>('/api/token', { userName: login, password: senha, grant_type: 'password' })
          .pipe(map(user => {
              if (user && user.access_token) {
                  localStorage.setItem('user', JSON.stringify(user));
                  this.currentUser.next(user);
              }

              return user;
          }));
  }

  logout(): void {
      localStorage.removeItem('user');
      this.currentUser.next(null);
  }

}

export interface IUser {
  access_token: string;
}
