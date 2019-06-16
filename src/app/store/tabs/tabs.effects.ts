import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { InitTabs, TabsActionTypes, AddTab,
  ExecuteQuery, UpdateTab, SaveToLocalStorage, RemoveTab, LoadTabs
} from './tabs.actions';
import { map, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import { SparqlService } from 'src/app/services/sparql.service';
import { of, EMPTY } from 'rxjs';
import { QueryHistory } from 'src/app/models/tabs';
import { LocalStorageService } from 'src/app/services/localstorage.service';

@Injectable()
export class TabsEffects {

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private sparqlService: SparqlService,
    private localStorageService: LocalStorageService
  ) {}


  @Effect()
  initTabs$ = this.actions$.pipe(
    ofType<InitTabs>(TabsActionTypes.InitTabs),
    map(() => {
      const tabs = this.localStorageService.loadSparqlTabs();
      if (tabs.length === 0) {
        return new AddTab();
      } else {
        return new LoadTabs(tabs);
      }
    })
  );

  @Effect()
  executeQuery$ = this.actions$.pipe(
    ofType<ExecuteQuery>(TabsActionTypes.ExecuteQuery),
    mergeMap((action) => {
      return this.sparqlService.executeSparql(action.tab.endpoint, action.tab.query).pipe(
        map((res: any) => {
          if (action.tab.query.startsWith('#')) {
            const title = action.tab.query.split('\n')[0];
            action.tab.title = title.substr(1, title.length);
          }

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

  @Effect()
  updateTab$ = this.actions$.pipe(
    ofType<UpdateTab>(TabsActionTypes.UpdateTab),
    map(() => new SaveToLocalStorage())
  );

  @Effect()
  removeTab$ = this.actions$.pipe(
    ofType<RemoveTab>(TabsActionTypes.RemoveTab),
    map(() => new SaveToLocalStorage())
  );

  @Effect()
  addTab$ = this.actions$.pipe(
    ofType<AddTab>(TabsActionTypes.AddTab),
    map(() => new SaveToLocalStorage())
  );

  @Effect({dispatch : false})
  saveToLocalStorage$ = this.actions$.pipe(
    ofType<SaveToLocalStorage>(TabsActionTypes.SaveToLocalStorage),
    withLatestFrom(this.store),
    map(([action, store]) => {
      const tabs = [];
      for (const id of store.tabs.ids) {
        const tab = store.tabs.entities[id];
        tabs.push({ id: tab.id, query : tab.query, endpoint: tab.endpoint, title : tab.title, history: tab.history });
      }
      this.localStorageService.saveSparqlTabs(tabs);
    })
  );

}

