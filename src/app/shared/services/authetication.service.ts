import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { SettingsService } from './settings.service';

import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private _currentUser: BehaviorSubject<IUser>;
  get currentUser(): BehaviorSubject<IUser> {
    return this._currentUser;
  }

  constructor(private _http: HttpClient,
              private _settings: SettingsService) {
      this._currentUser = new BehaviorSubject<IUser>(JSON.parse(localStorage.getItem('user')));
  }

  isLocalTokenValid(): boolean {
    if (this.currentUser.value === null) {
        return false;
    }
    const decoded: any = jwt_decode(this.currentUser.value.token);
    const tokenExpiration = decoded.exp * 1000;
    const now = Date.now();
    return tokenExpiration > now;
  }

  login(email: string, password: string): Observable<IUser> {
      return this._http.post<IUser>(`${this._settings.apiUrl}/token`, { email, password })
          .pipe(map(user => {
              if (user && user.token) {
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
  name: string;
  token: string;
  refresh: string;
}
