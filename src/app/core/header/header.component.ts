import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/store';
import { Observable } from 'rxjs';
import { SparqlTab } from 'src/app/models/tabs';
import { getTabs, getActiveTab } from 'src/app/store/tabs/tabs.selectors';
import * as TabsActions from 'src/app/store/tabs/tabs.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  tabs$: Observable<SparqlTab[]>;
  activeTab$: Observable<SparqlTab>;

  constructor(private store: Store<AppState>) {
    this.tabs$ = this.store.pipe(select(getTabs));
    this.activeTab$ = this.store.pipe(select(getActiveTab));
  }

  newTab() {
    this.store.dispatch(TabsActions.AddTab());
  }

  setActive(tab: SparqlTab) {
    this.store.dispatch(TabsActions.SetActiveTab({tab}));
  }

  removeTab(tab: SparqlTab) {
    this.store.dispatch(TabsActions.RemoveTab({tab}));
  }

  duplicateTab(tab: SparqlTab) {
    this.store.dispatch(TabsActions.DuplicateTab({tab}));
  }
}
