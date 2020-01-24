import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class SparqlService {

  constructor(private http: HttpClient) {}

  public executeSparql(endpoint: string, query: string, accept: string): Observable<any> {
    const payload = `query=${encodeURIComponent(query)}`;
    const options = {
      headers: this.getHeaders(accept)
    };
    if (accept.indexOf('json') === -1) {
      // tslint:disable-next-line:no-string-literal
      options['responseType'] = 'text';
    }
    return this.http.post(endpoint, payload, options).pipe(
      mergeMap((res) => of(res)),
      catchError((err: HttpErrorResponse) => throwError(err.error))
    );
  }

  private getHeaders(accept: string): HttpHeaders {
    return new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', accept);
  }
}

