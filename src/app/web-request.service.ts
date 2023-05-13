import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebrequestService {
  readonly  ROOT_URL :string;
  constructor(private http: HttpClient) {
    this.ROOT_URL = `http://localhost:9090`;
   }
 

  get<T>(uri: string): Observable<T>{
    return this.http.get<T>(`${this.ROOT_URL}/${uri}`);
  }
  post<T>(uri: string, body: Object):Observable<T> {
    return this.http.post<T>(`${this.ROOT_URL}/${uri}`, body);
  }
  delete<T>(uri: string):Observable<T> {
    return this.http.delete<T>(`${this.ROOT_URL}/${uri}`);
  }
  patch<T>(uri: string, body: Object) :Observable<T>{
    return this.http.patch<T>(`${this.ROOT_URL}/${uri}`, body);
  }
}
