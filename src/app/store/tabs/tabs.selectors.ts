import { TabsState, tabsAdapter } from './tabs.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const getState = createFeatureSelector<TabsState>('tabs');
export const {
  selectAll: getTabs,
  selectEntities: getTabsEntities,
  selectTotal: getTabsTotal
} = tabsAdapter.getSelectors(getState);

export const getTabsLoading = createSelector(
  getState,
  (state) => state.loading
);

export const getActiveTab = createSelector(
  getState,
  (state) => state.activeTab
);
