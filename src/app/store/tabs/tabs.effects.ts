import { Injectable } from '@angular/core';
import { Actions, ofType, Effect, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../store';
import { map, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import { SparqlService } from 'src/app/services/sparql.service';
import { of } from 'rxjs';
import { QueryHistory } from 'src/app/models/tabs';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import * as TabsActions from './tabs.actions';


@Injectable()
export class TabsEffects {

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private sparqlService: SparqlService,
    private localStorageService: LocalStorageService
  ) {}

  initTabs$ = createEffect(() => this.actions$.pipe(
      ofType(TabsActions.InitTabs),
      map(() => {
        const tabs = this.localStorageService.loadSparqlTabs();
        if (tabs.length === 0) {
          return TabsActions.AddTab();
        } else {
          return TabsActions.LoadTabs({ tabs });
        }
      })
    )
  );

  executeQuery$ = createEffect(() => this.actions$.pipe(
      ofType(TabsActions.ExecuteQuery),
      mergeMap((action) => {
        return this.sparqlService.executeSparql(action.tab.endpoint, action.tab.query, action.accept).pipe(
          map((res: any) => {
            if (action.tab.query.startsWith('#')) {
              const title = action.tab.query.split('\n')[0];
              action.tab.title = title.substr(1, title.length);
            }

            action.tab.queryResult = res;
            action.tab.queryError = null;

            function getContentType(val: string) {
              if (val.startsWith('{')) { return 'javascript'; }
              if (val.indexOf('"<?xml') >= 0) { return 'application/xml'; }
              return 'text/plain';
            }

            action.tab.queryResultType = getContentType(JSON.stringify(action.tab.queryResult));
            if (action.tab.queryResultType === 'javascript') {
              action.tab.queryResultStr = JSON.stringify(action.tab.queryResult, null, '\t');
            } else {
              action.tab.queryResultStr = action.tab.queryResult;
            }

            const sameQuery = action.tab.history[0]
            if (sameQuery && sameQuery.query !== action.tab.query) {
              action.tab.history.unshift(QueryHistory.fromTab(action.tab));
            }
            return TabsActions.UpdateTab({ tab: action.tab });
          }),
          catchError(err => {
            action.tab.queryResult = null;
            action.tab.queryError = err;
            action.tab.queryResultStr = '';
            action.tab.history.unshift(QueryHistory.fromTab(action.tab));
            return of(TabsActions.UpdateTab({ tab: action.tab }));
          })
        );
      })
    )
  );

  updateTab$ = createEffect(() => this.actions$.pipe(
    ofType(TabsActions.UpdateTab),
    map(() => TabsActions.SaveToLocalStorage())
  ));

  removeTab$ = createEffect(() => this.actions$.pipe(
    ofType(TabsActions.RemoveTab),
    map(() => TabsActions.SaveToLocalStorage())
  ));

  addTab$ = createEffect(() => this.actions$.pipe(
    ofType(TabsActions.AddTab),
    map(() => TabsActions.SaveToLocalStorage())
  ));

  duplicateTab$ = createEffect(() => this.actions$.pipe(
    ofType(TabsActions.DuplicateTab),
    map(() => TabsActions.SaveToLocalStorage())
  ));

  saveToLocalStorage$ = createEffect(() => this.actions$.pipe(
    ofType(TabsActions.SaveToLocalStorage),
    withLatestFrom(this.store),
    map(([action, store]) => {
      const tabs = [];
      for (const id of store.tabs.ids) {
        const tab = store.tabs.entities[id];
        tabs.push({ id: tab.id, query : tab.query, endpoint: tab.endpoint, title : tab.title, history: tab.history });
      }
      this.localStorageService.saveSparqlTabs(tabs);
    })
  ), { dispatch: false });

}

