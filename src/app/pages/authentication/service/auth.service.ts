import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, throwError } from 'rxjs';
import { UsersModel } from '../model/users.model';
import { LoginRepository } from 'src/app/repositories/login.repository';
import { cookieOptions, nameCookieAccessToken } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};
  private _isError = false;
  private _isErrorSubject = new Subject<boolean>();

  constructor(
    public router: Router,
    private authService: LoginRepository,
    protected cookieService: CookieService) { }



  signIn(user: UsersModel) {
    this.authService.post(user).subscribe({
      next: (res: any) => {
        this.cookieService.set(nameCookieAccessToken, res.authorization, cookieOptions);
        this.router.navigate(['/dashboards/home']);
      },
      error: () => {
        console.log("teste errado")
        this.removeAccessTokenFromCookie();
        //window.location.reload();
        this.setError(true);
      },
    });
  }

  get isError() {
    return this._isError;
  }

  get isErrorSubject() {
    return this._isErrorSubject;
  }

  setError(value: boolean) {
    this._isError = value;
    this._isErrorSubject.next(value);
  }


  doLogout() {
    let removeToken = this.removeAccessTokenFromCookie();
    if (removeToken === undefined) {
      this.router.navigate(['/authentication/side-login']);
    } else {
      window.location.reload();
    }
  }


  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      msg = error.error.message;
    } else {
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }

  isLoggedIn(): boolean {
    const token = this.getAccessTokenFromCookie();
    return !!token;
  }

  clearAccessTokenIfExpired() {
    const token = this.getAccessTokenFromCookie();
    if (token) {
      const isTokenExpired = this.isTokenExpired(token);

      if (isTokenExpired) {
        this.removeAccessTokenFromCookie();
      }
    }
  }

  getAccessTokenFromCookie(): string | null {
    return this.cookieService.get(nameCookieAccessToken);
  }

  isTokenExpired(token: string): boolean {
    const currentTimestamp = Date.now() / 1000;
    const tokenExpiration = this.extractTokenExpiration(token);
    return currentTimestamp >= tokenExpiration;
  }

  extractTokenExpiration(token: string): number {
    const tokenParts = token.split('.');
    const payloadBase64 = tokenParts[1];
    const payload = JSON.parse(atob(payloadBase64));

    return payload.exp;
  }

  removeAccessTokenFromCookie(): void {
    return this.cookieService.delete(nameCookieAccessToken);
  }
}
