import { TabsActions, TabsActionTypes } from './tabs.actions';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { SparqlTab } from 'src/app/models/tabs';

export interface TabsState extends EntityState<SparqlTab> {
  loading?: boolean;
  activeTab: SparqlTab;
}

export const tabsAdapter: EntityAdapter<SparqlTab> = createEntityAdapter<SparqlTab>();

export const initialTabsState = tabsAdapter.getInitialState({
  loading: false, activeTab: null
});

export function reducer(state = initialTabsState, action: TabsActions): TabsState {
  switch (action.type) {
    case TabsActionTypes.InitTabs: {
      return {
        ...state,
      };
    }

    case TabsActionTypes.AddTab: {
      const tab = new SparqlTab(`SPARQL ${state.ids.length + 1}`);
      return tabsAdapter.addOne(
        tab,
        {
          ...state,
          loading: false,
          activeTab: tab
        }
      );
    }

    case TabsActionTypes.SetActiveTab: {
      return {
        ...state,
        activeTab: action.tab
      };
    }

    case TabsActionTypes.RemoveTab: {
      const tabIndex: number = (state.ids as Array<string>).indexOf(action.tab.id);
      let newActiveTab = null;
      if (tabIndex === 0) {
        newActiveTab =  state.entities[state.ids[1]];
      } else {
        newActiveTab = state.entities[state.ids[0]];
      }

      return tabsAdapter.removeOne(
        action.tab.id,
        {
          ...state,
          activeTab: newActiveTab
        }
      );
    }

    case TabsActionTypes.ExecuteQuery: {
      return {
        ...state,
        loading: true,
        activeTab: null
      };
    }

    case TabsActionTypes.UpdateTab: {
      return tabsAdapter.upsertOne(
        action.tab,
        {
          ...state,
          loading: false,
          activeTab: action.tab
        }
      );
    }

    case TabsActionTypes.SaveTab: {
      return tabsAdapter.upsertOne(
        action.tab,
        state
      );
    }

    case TabsActionTypes.LogHistory: {
      return {
        ...state
      };
    }

    default: {
      return state;
    }
  }
}
