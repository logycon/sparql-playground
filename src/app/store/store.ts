import { ActionReducerMap } from '@ngrx/store';

import * as fromTabs from './tabs/tabs.reducer';

import { TabsEffects } from './tabs/tabs.effects';

export interface AppState {
  tabs: fromTabs.TabsState;
}

export const AppReducers: ActionReducerMap<AppState> = {
  tabs: fromTabs.reducer
};

export const AppEffects = [
  TabsEffects
];
