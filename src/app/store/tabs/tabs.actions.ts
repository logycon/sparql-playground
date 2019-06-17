import { Action } from '@ngrx/store';
import { SparqlTab } from 'src/app/models/tabs';

export enum TabsActionTypes {
  InitTabs = '[TABS] Init',
  AddTab = '[TABS] Add Tab',
  LoadTabs = '[TABS] Load Tabs',
  SetActiveTab = '[TABS] Set Active Tab',
  RemoveTab = '[TABS] Remove Tab',
  ExecuteQuery = '[TABS] Execute Query',
  LogHistory = '[TABS] Log History',
  UpdateTab = '[TABS] Update Tab',
  SaveTab = '[TABS] Save Tab',
  SaveToLocalStorage = '[TABS] Save to Local Storage',
  DuplicateTab = '[TABS] Duplicate Tab'
}

export class InitTabs implements Action {
  readonly type = TabsActionTypes.InitTabs;
}

export class AddTab implements Action {
  readonly type = TabsActionTypes.AddTab;
}

export class LoadTabs implements Action {
  readonly type = TabsActionTypes.LoadTabs;
  constructor(public tabs: SparqlTab[]) {}
}

export class SetActiveTab implements Action {
  readonly type = TabsActionTypes.SetActiveTab;
  constructor(public tab: SparqlTab) {}
}

export class RemoveTab implements Action {
  readonly type = TabsActionTypes.RemoveTab;
  constructor(public tab: SparqlTab) {}
}

export class ExecuteQuery implements Action {
  readonly type = TabsActionTypes.ExecuteQuery;
  constructor(public tab: SparqlTab) {}
}

export class UpdateTab implements Action {
  readonly type = TabsActionTypes.UpdateTab;
  constructor(public tab: SparqlTab) {}
}

export class LogHistory implements Action {
  readonly type = TabsActionTypes.LogHistory;
  constructor(public tab: SparqlTab) {}
}

export class SaveTab implements Action {
  readonly type = TabsActionTypes.SaveTab;
  constructor(public tab: SparqlTab) {}
}

export class SaveToLocalStorage implements Action {
  readonly type = TabsActionTypes.SaveToLocalStorage;
  constructor() {}
}

export class DuplicateTab implements Action {
  readonly type = TabsActionTypes.DuplicateTab;
  constructor(public tab: SparqlTab) {}
}

export type TabsActions = InitTabs | AddTab | LoadTabs | SetActiveTab | RemoveTab |
  ExecuteQuery | UpdateTab | LogHistory | SaveTab |
  SaveToLocalStorage | DuplicateTab
;
