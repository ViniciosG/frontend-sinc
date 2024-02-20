import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private apiUrl = environment.apiUrlLogin;

    constructor(private http: HttpClient) {
    }
  
  
    public post(item: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}login`, item);
    }
  
    public refresh(): Observable<any> {
      return this.http.get(`${this.apiUrl}refresh`);
    }
}
