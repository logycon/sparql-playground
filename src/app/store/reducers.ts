import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';

import * as fromTabs from './tabs/tabs.reducer';
import { TabsEffects } from './tabs/tabs.effects';


export interface AppState {
  tabs: fromTabs.TabsState;
}

export const reducers: ActionReducerMap<AppState> = {
  tabs: fromTabs.reducer
};

export const AppEffects = [
  TabsEffects
];

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
