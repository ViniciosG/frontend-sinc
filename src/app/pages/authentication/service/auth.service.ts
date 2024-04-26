import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, throwError } from 'rxjs';
import { LoginRepository } from 'src/app/repositories/login.repository';
import { UsersModel } from '../model/users.model';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  cookieAuthorization = "authorization"
  cookieNameUser = "userName"
  cookieIsAdm = "isAdm"
  cookieAccessPermissions = "accessPermissions"
  cookieContextId = "contextId"
  cookieSellerId = "contextId"
  currentUser = {};
  private _isError = false;
  private _isErrorSubject = new Subject<boolean>();
  isLoading: boolean = false;
  userName: string;
  isAdm: boolean;
  contextId: number;
  accessPermissions: number[];
  authorization: string = "";
  sellerId: number;

  onSaveSuccess: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public router: Router,
    private authService: LoginRepository,
    protected cookieService: CookieService) {
    if (this.cookieService.check(this.cookieAuthorization) && this.authorization === "") {
      this.userName = this.cookieService.get(this.cookieNameUser)
      this.authorization = this.cookieService.get(this.cookieAuthorization)
      this.accessPermissions = this.cookieService.get(this.cookieAccessPermissions).split(',').map(Number);
      this.isAdm = this.cookieService.get(this.cookieIsAdm) === "true"
      this.contextId = Number(this.cookieService.get(this.cookieContextId))
      this.sellerId = Number(this.cookieService.get(this.cookieSellerId))
    }
  }




  signIn(user: UsersModel) {
    this.isLoading = true;
    this.authService.post(user).subscribe({
      next: (res: any) => {
        const now = new Date();
        now.setHours(now.getHours() + 3);
        this.userName = res.name;
        this.authorization = res.authorization;
        this.accessPermissions = res.access_permissions;
        this.isAdm = res.is_adm;
        this.contextId = res.context?.id;
        this.sellerId = res.seller?.id
        this.cookieService.set(this.cookieAuthorization, res.authorization, now, '/');
        this.cookieService.set(this.cookieAccessPermissions, String(this.accessPermissions), now, '/');
        this.cookieService.set(this.cookieIsAdm, String(this.isAdm), now, '/');
        this.cookieService.set(this.cookieNameUser, this.userName, now, '/');
        this.cookieService.set(this.cookieContextId, String(this.contextId), now, '/');
        this.cookieService.set(this.cookieSellerId, String(this.sellerId), now, '/');
        this.router.navigate(['/']);
        this.isLoading = false;
        this.onSaveSuccess.emit();

      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/authentication/login']);
        this.removeAccessTokenFromCookie();
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
    this.removeAccessTokenFromCookie();
    window.location.reload();
  }

  isAccess(access: number | undefined): Boolean {
    if (access == undefined) {
      return true
    }

    if (this.isAdm) {
      return true
    }
    return this.accessPermissions.includes(access);
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
    return this.authorization !== "";
  }

  getAccessToken(): string | null {
    return this.authorization
  }

  isTokenExpired(token: string): boolean {
    return !this.cookieService.check(this.cookieAuthorization)
  }

  isSeller(): boolean {
    return this.sellerId > 0
  }

  removeAccessTokenFromCookie(): void {
    this.userName = ""
    this.authorization = ""
    this.accessPermissions = []
    this.isAdm = false
    this.contextId = 0
    this.sellerId = 0
    this.cookieService.deleteAll('/');
  }
}
