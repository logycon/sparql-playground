import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SparqlService {

  constructor(private http: HttpClient) {}

  public executeSparql(endpoint: string, query: string): Observable<any> {
    const payload = `query=${query}`;
    return this.http.post(endpoint, payload, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).pipe(
      mergeMap((res) => of(res)),
      catchError((err) => throwError(err))
    );
  }
}
