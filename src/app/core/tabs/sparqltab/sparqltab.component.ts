import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { SplitComponent } from 'angular-split';
import { AppState } from 'src/app/store/reducers';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { SparqlTab } from 'src/app/models/tabs';
import { getActiveTab } from 'src/app/store/tabs/tabs.selectors';
import { takeUntil } from 'rxjs/operators';
import { ExecuteQuery, UpdateTab, SaveTab } from 'src/app/store/tabs/tabs.actions';
import * as CodeMirror from 'codemirror';

@Component({
  selector: 'app-sparql',
  templateUrl: './sparqltab.component.html',
  styleUrls: ['./sparqltab.component.scss']
})
export class SparqlTabComponent implements OnInit, AfterViewInit, OnDestroy {
  private unsub$: Subject<void> = new Subject<void>();

  public content: string;

  @ViewChild('split')
  public split: SplitComponent;

  @ViewChild('leftpane')
  public leftPane: ElementRef;

  @ViewChild('results')
  public results: ElementRef;
  private resultsEditor: any;

  @ViewChild('query')
  public query: ElementRef;
  private queryEditor: any;

  activeTab$: Observable<SparqlTab>;
  activeTab: SparqlTab;

  queryEditorOptions = {
    lineNumbers: true,
    theme: 'material',
    mode: 'sparql',
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
          this.store.dispatch(new SaveTab(this.activeTab));
        }
        this.activeTab = tab;
        this.changeDetector.detectChanges();
        if (this.activeTab.query && this.queryEditor) {
          this.queryEditor.setValue(this.activeTab.query);
        }
        if (this.activeTab.queryResult && this.resultsEditor) {
          this.resultsEditor.setValue(this.activeTab.queryResultStr);
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

  execute() {
    this.activeTab.query = this.queryEditor.getValue();
    this.store.dispatch(new ExecuteQuery(this.activeTab));
  }

}
