import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { SparqlTab } from 'src/app/models/tabs';
import * as TabsActions from './tabs.actions';


export interface TabsState extends EntityState<SparqlTab> {
  loading: boolean;
  activeTab: SparqlTab;
}

export const tabsAdapter: EntityAdapter<SparqlTab> = createEntityAdapter<SparqlTab>();

export const tabsInitialState = tabsAdapter.getInitialState({
  loading: false, activeTab: null
});

const tabsReducer = createReducer(
  tabsInitialState,

  on(TabsActions.InitTabs, ( state ) => {
    return { ...state } ;
  }),

  on(TabsActions.AddTab, ( state ) => {
    const tab = new SparqlTab();
    return tabsAdapter.addOne( tab, { ...state, loading: false, activeTab: tab });
  }),

  on(TabsActions.LoadTabs, (state, { tabs }) => {
    return tabsAdapter.addMany(tabs, { ...state, loading: false, activeTab: tabs[0] });
  }),

  on(TabsActions.SetActiveTab, (state, { tab }) => {
    return {  ...state, activeTab: tab };
  }),

  on(TabsActions.DuplicateTab, (state, { tab }) => {
    const newTab = SparqlTab.duplicate(tab);
    return tabsAdapter.upsertOne(newTab, { ...state, activeTab: newTab });
  }),

  on(TabsActions.RemoveTab, (state, { tab }) => {
    const removeIndex = (state.ids as Array<string>).indexOf(tab.id);
    const removeTab = state.entities[tab.id];
    const currentActiveTab = state.activeTab;
    let newActiveTab;
    if (removeTab.id === currentActiveTab.id) {
      const newActiveIndex = removeIndex === 0 ? removeIndex : removeIndex - 1;
      newActiveTab = { ...state.entities[state.ids[newActiveIndex]] };
    } else {
      newActiveTab = currentActiveTab;
    }
    return tabsAdapter.removeOne( removeTab.id, { ...state, activeTab: newActiveTab });
  }),

  on(TabsActions.ExecuteQuery, (state, { tab }) => {
    return {  ...state, loading: true, activeTab: null };
  }),

  on(TabsActions.UpdateTab, (state, { tab }) => {
    return tabsAdapter.upsertOne(tab, { ...state, loading: false, activeTab: tab });
  }),

  on(TabsActions.SaveTab, (state, { tab }) => {
    return tabsAdapter.upsertOne(tab, state);
  }),

  on(TabsActions.SaveToLocalStorage, (state) => {
    return { ...state };
  }),

  on(TabsActions.LogHistory, (state, { tab }) => {
    return { ...state };
  })
);

export function reducer(state: TabsState | undefined, action: Action) {
  return tabsReducer(state, action);
}



