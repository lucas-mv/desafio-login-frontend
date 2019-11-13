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
      return this._http.post<IUser>(`${this._settings.apiUrl}/account/authenticate`, { email, password })
          .pipe(map(user => {
              // login successful if there's a jwt token in the response
              if (user && user.token) {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  localStorage.setItem('user', JSON.stringify(user));
                  this.currentUser.next(user);
              }

              return user;
          }));
  }

  logout(): void {
      // remove user from local storage to log user out
      localStorage.removeItem('user');
      this.currentUser.next(null);
  }

  refreshToken(): Observable<{ token: string }> {
    return this._http.get<{ token: string }>(`${this._settings.apiUrl}/account/refresh/${this.getRefreshToken()}`)
            .pipe(
              tap((response: { token: string }) => {
                this.currentUser.value.token = response.token;
                localStorage.setItem('user', JSON.stringify(this.currentUser.value));
              })
          );
  }

  hasRefreshToken(): boolean {
    if (this.currentUser.value == null) {
      return false;
    }

    return true;
  }

  private getRefreshToken(): string {
    return this.currentUser.value.refresh;
  }

}

export interface IUser {
  name: string;
  token: string;
  refresh: string;
}
