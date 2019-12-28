import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class SparqlService {

  constructor(private http: HttpClient) {}

  public executeSparql(endpoint: string, query: string): Observable<any> {
    const payload = `query=${encodeURIComponent(query)}`;
    const headers = this.getHeaders();
    return this.http.post(endpoint, payload, { headers }).pipe(
      mergeMap((res) => of(res)),
      catchError((err) => throwError(err))
    );
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');
  }
}

