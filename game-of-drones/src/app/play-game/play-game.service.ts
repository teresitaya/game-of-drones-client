
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayGameService {
  constructor(private http: HttpClient) {
  }

  public saveMove(data): Observable<any> {
    const url = '/api/v1/move/';
    return this.http.post(url, data);
  }
  public createRound(data): Observable<any> {
    const url = '/api/v1/round/';
    return this.http.post(url, data);
  }
  public putRound(data): Observable<any> {
    const url = '/api/v1/round/'+ data.id;
    return this.http.put(url, data);
  }
  public getRound(id): Observable<any> {
    const url = '/api/v1/round/' + id;
    return this.http.get(url);
  }
  public getRules(): Observable<any> {
    const url = '/api/v1/rules/';
    return this.http.get(url);
  }

}
