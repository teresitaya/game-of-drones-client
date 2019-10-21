
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GameConfigurationService {
    constructor(private http: HttpClient) {
    }

    public createMatch(data): Observable<any> {
      const url = '/api/v1/match/';
      return this.http.post(url, data);
  }
  public putMatch(data): Observable<any> {
    const url = '/api/v1/match/' + data.id;
    return this.http.put(url, data);
  }

}
