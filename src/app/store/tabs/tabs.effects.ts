import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { InitTabs, TabsActionTypes, AddTab,
  ExecuteQuery, UpdateTab, LogHistory
} from './tabs.actions';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { SparqlService } from 'src/app/services/sparql.service';
import { of } from 'rxjs';
import { QueryHistory } from 'src/app/models/tabs';

@Injectable()
export class TabsEffects {

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private service: SparqlService
  ) {}


  @Effect()
  $initTabs = this.actions$.pipe(
    ofType<InitTabs>(TabsActionTypes.InitTabs),
    map(() => new AddTab())
  );

  @Effect()
  $executeQuery = this.actions$.pipe(
    ofType<ExecuteQuery>(TabsActionTypes.ExecuteQuery),
    mergeMap((action) => {
      return this.service.executeSparql(action.tab.endpoint, action.tab.query).pipe(
        map((res: any) => {
          action.tab.queryResult = res;
          action.tab.queryError = null;
          action.tab.queryResultStr = JSON.stringify(action.tab.queryResult, null, '\t');
          action.tab.history.unshift(QueryHistory.fromTab(action.tab));
          return new UpdateTab(action.tab);
        }),
        catchError(err => {
          action.tab.queryResult = null;
          action.tab.queryError = err;
          action.tab.queryResultStr = '';
          action.tab.history.unshift(QueryHistory.fromTab(action.tab));
          return of(new UpdateTab(action.tab));
        })
      );
    })
  );

}

