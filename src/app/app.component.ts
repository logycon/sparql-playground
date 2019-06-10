import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/reducers';
import { InitTabs } from './store/tabs/tabs.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sparql-playground';

  constructor(
    private store: Store<AppState>
  ) {
    this.store.dispatch(new InitTabs());
  }
}
