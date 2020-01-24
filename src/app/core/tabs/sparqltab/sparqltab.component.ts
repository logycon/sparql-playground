/* tslint:disable:no-string-literal */
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { SplitComponent } from 'angular-split';
import { AppState } from 'src/app/store/store';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { SparqlTab } from 'src/app/models/tabs';
import { getActiveTab } from 'src/app/store/tabs/tabs.selectors';
import { takeUntil } from 'rxjs/operators';
import * as TabsActions from 'src/app/store/tabs/tabs.actions';
import { Warning } from '../../../models/misc';

import * as CodeMirror from 'codemirror';

@Component({
  selector: 'app-sparql',
  templateUrl: './sparqltab.component.html',
  styleUrls: ['./sparqltab.component.scss']
})
export class SparqlTabComponent implements OnInit, AfterViewInit, OnDestroy {
  private unsub$: Subject<void> = new Subject<void>();

  @ViewChild('split', { static: false })
  public split: SplitComponent;

  @ViewChild('leftpane', { static: false })
  public leftPane: ElementRef;

  @ViewChild('results', { static: false })
  public results: ElementRef;
  private resultsEditor: any;

  @ViewChild('query', { static: false })
  public query: ElementRef;
  private queryEditor: any;

  activeTab$: Observable<SparqlTab>;
  activeTab: SparqlTab;
  warning: Warning;
  acceptOptions = [
    { text: 'SELECT: application/json', value: 'application/json'},
    { text: 'SELECT: text/tab-separated-values', value: 'text/tab-separated-values'},
    { text: 'SELECT text/csv', value: 'text/csv' },
    { text: 'CONSTRUCT: application/rdf+xml', value: 'application/rdf+xml'},
    { text: 'CONSTRUCT: application/x-turtle', value: 'application/x-turtle'},
    { text: 'CONSTRUCT: application/ntriples', value: 'application/ntriples'},
    { text: 'CONSTRUCT: application/ld+json', value: 'application/ld+json'},
    { text: 'CONSTRUCT: text/rdf+n3', value: 'text/rdf+n3'}
  ];
  accept = this.acceptOptions[0].value;


  queryEditorOptions = {
    lineNumbers: true,
    theme: 'material',
    mode: 'application/sparql-query',
    matchBrackets: true,
    foldGutter: true,
    extraKeys: {'Ctrl-Q' : (cm) => { console.log(cm); cm.foldCode(cm.getCursor()); }},
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
  };

  resultsEditorOptions = {
    lineNumbers: true,
    theme: 'material',
    mode: 'javascript',
    foldGutter: true,
    extraKeys: {'Ctrl-Q' : (cm) => { console.log(cm); cm.foldCode(cm.getCursor()); }},
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
  };

  constructor(
    private store: Store<AppState>,
    private changeDetector: ChangeDetectorRef) {
    this.activeTab$ = this.store.pipe(select(getActiveTab));
  }

  ngOnInit() {
    this.activeTab$.pipe(takeUntil(this.unsub$)).subscribe((tab: SparqlTab) => {
      if (tab) {
        this.initCodeMirror();
        if (this.activeTab) {
          this.activeTab.query = this.queryEditor.getValue();
        }
        this.activeTab = tab;
        this.changeDetector.detectChanges();
        if (this.activeTab.query && this.queryEditor) {
          this.queryEditor.setValue(this.activeTab.query);
        }
        if (this.activeTab.queryResult && this.resultsEditor) {
          this.resultsEditor.setOption('mode', this.activeTab.queryResultType);
          this.resultsEditor.setValue(this.activeTab.queryResultStr);
        } else {
          if (this.activeTab.queryError) {
            // tslint:disable-next-line:max-line-length
            const msg = this.activeTab.queryError.error instanceof ProgressEvent ? this.activeTab.queryError.message : this.activeTab.queryError.error || this.activeTab.queryError.message;
            this.resultsEditor.setValue(msg);
            this.resultsEditor.setOption('mode', 'text/plain');
          }
        }
      }
    });
  }

  ngAfterViewInit() {
    this.split.dragProgress$.subscribe(x => {
      if (this.leftPane) {
        this.changeDetector.detectChanges();
      }
    });
    this.initCodeMirror();
  }

  ngOnDestroy() {
    this.unsub$.unsubscribe();
    this.unsub$.complete();
  }

  private initCodeMirror() {
    if (!this.queryEditor && this.query) {
      this.queryEditor = CodeMirror.fromTextArea(this.query.nativeElement, this.queryEditorOptions);
      this.queryEditor.setValue(this.activeTab.query);
    }

    if (!this.resultsEditor && this.results) {
      this.resultsEditor = CodeMirror.fromTextArea(this.results.nativeElement, this.resultsEditorOptions);
      this.resultsEditor.setOption('readOnly', true);
    }
  }

  formatQuery() {
    CodeMirror.commands['selectAll'](this.queryEditor);
    const range = { from: this.queryEditor.getCursor(true), to: this.queryEditor.getCursor(false)};
    this.queryEditor.autoFormatRange(range.from, range.to);
  }

  execute() {
    this.formatQuery();
    const sql = this.queryEditor.getValue();
    if (sql.toLowerCase().includes('select') && !sql.toLowerCase().includes('limit')) {
      this.warning = {
        title: 'Selecting without Limit',
        message: 'Selecting without limit is not recommended. Are you sure to proceed?'
      };
    } else {
      this.executeQuery();
    }
  }

  private executeQuery() {
    this.activeTab.query = this.queryEditor.getValue();
    this.store.dispatch(TabsActions.ExecuteQuery({tab: this.activeTab, accept: this.accept}));
  }

  warned(proceed: boolean) {
    if (proceed) {
      this.executeQuery();
    }
  }

  repeatQuery(sql: string) {
    this.queryEditor.setValue(sql);
  }
}
