import { createAction, props } from '@ngrx/store';
import { SparqlTab } from 'src/app/models/tabs';

export const InitTabs = createAction('[TABS] Init');
export const AddTab = createAction('[TABS] Add Tab')

export const LoadTabs = createAction(
  '[TABS] Load Tabs',
  props<{ tabs: SparqlTab[] }>()
);

export const SetActiveTab = createAction(
  '[TABS] Set Active Tab',
  props<{ tab: SparqlTab }>()
);

export const RemoveTab = createAction(
  '[TABS] Remove Tab',
  props<{ tab: SparqlTab }>()
);

export const ExecuteQuery = createAction(
  '[TABS] Execute Query',
  props<{ tab: SparqlTab, accept: string }>()
);

export const LogHistory = createAction(
  '[TABS] Log History',
  props<{ tab: SparqlTab }>()
);

export const UpdateTab = createAction(
  '[TABS] Update Tab',
  props<{ tab: SparqlTab }>()
);

export const SaveTab = createAction(
  '[TABS] Save Tab',
  props<{ tab: SparqlTab }>()
);

export const SaveToLocalStorage = createAction('[TABS] Save to Local Storage');

export const DuplicateTab = createAction(
  '[TABS] Duplicate Tab',
  props<{ tab: SparqlTab }>()
);
