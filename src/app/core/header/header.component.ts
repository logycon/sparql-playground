import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { Observable } from 'rxjs';
import { SparqlTab } from 'src/app/models/tabs';
import { getTabs, getActiveTab } from 'src/app/store/tabs/tabs.selectors';
import { AddTab, SetActiveTab, RemoveTab } from 'src/app/store/tabs/tabs.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  tabs$: Observable<SparqlTab[]>;
  activeTab$: Observable<SparqlTab>;

  constructor(private store: Store<AppState>) {
    this.tabs$ = this.store.pipe(select(getTabs));
    this.activeTab$ = this.store.pipe(select(getActiveTab));
  }

  ngOnInit() {
  }

  newTab() {
    this.store.dispatch(new AddTab());
  }

  setActive(tab: SparqlTab) {
    this.store.dispatch(new SetActiveTab(tab));
  }

  removeTab(tab: SparqlTab) {
    this.store.dispatch(new RemoveTab(tab));
  }



}
