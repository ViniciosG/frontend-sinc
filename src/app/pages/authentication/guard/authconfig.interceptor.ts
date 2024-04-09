
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler, HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authToken = this.authService.getAccessTokenFromCookie();
    if (authToken) {
      const isTokenExpired = this.authService.isTokenExpired(authToken);

      if (isTokenExpired) {
        this.authService.doLogout();
      } else {
        req = req.clone({
          setHeaders: {
            Authorization: authToken,
          },
        });
      }
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.authService.doLogout();
        }

        return throwError(error);
      })
    );
  }
}
