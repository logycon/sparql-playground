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
      const tab = new SparqlTab();
      return tabsAdapter.addOne(
        tab,
        {
          ...state,
          loading: false,
          activeTab: tab
        }
      );
    }

    case TabsActionTypes.LoadTabs: {
      return tabsAdapter.addMany(action.tabs, { ...state, loading: false, activeTab: action.tabs[0] });
    }

    case TabsActionTypes.SetActiveTab: {
      return {
        ...state,
        activeTab: action.tab
      };
    }

    case TabsActionTypes.DuplicateTab: {
      const newTab = SparqlTab.duplicate(action.tab);
      return tabsAdapter.upsertOne(newTab, { ...state, activeTab: newTab });
    }

    case TabsActionTypes.RemoveTab: {
      const removeIndex = (state.ids as Array<string>).indexOf(action.tab.id);
      const removeTab = state.entities[action.tab.id];
      const currentActiveTab = state.activeTab;
      let newActiveTab;
      if (removeTab.id === currentActiveTab.id) {
        const newActiveIndex = removeIndex === 0 ? removeIndex : removeIndex - 1;
        newActiveTab = { ...state.entities[state.ids[newActiveIndex]] };
      } else {
        newActiveTab = currentActiveTab;
      }

      return tabsAdapter.removeOne(
        removeTab.id,
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

    case TabsActionTypes.SaveToLocalStorage:
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
