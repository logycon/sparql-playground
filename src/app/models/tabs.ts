import { Guid } from './utils';

export class QueryHistory {
  public endpoint: string;
  public query: string;
  public queryResult: any;
  public queryResultStr: string;
  public queryError: any;

  static fromTab(tab: SparqlTab): QueryHistory {
    const q = new QueryHistory();
    q.endpoint = tab.endpoint;
    q.query = tab.query;
    q.queryResult = tab.queryResult;
    q.queryResultStr = tab.queryResultStr;
    q.queryError = tab.queryError;
    return q;
  }
}

export abstract class Tab {
  public id: string;
  public title: string;
  public endpoint: string;

  constructor() {
    this.id = Guid.newGuid();
  }
}

export class SparqlTab extends Tab {
  public query: string;
  public queryResult: any;
  public queryResultStr: string;
  public queryError: any;
  public history: QueryHistory[];
  public queryResultType: string;

  public constructor() {
    super();
    this.query = '#wikipedia\nselect * where { ?s a owl:Ontology. }';
    this.endpoint = 'https://query.wikidata.org/sparql';
    const title = this.query.split('\n')[0];
    this.title = title.substr(1, title.length);
    this.queryResult = null;
    this.queryResultStr = '';
    this.history = [];
  }

  public static duplicate(tab: SparqlTab): SparqlTab {
    const newTab: SparqlTab = {...tab};
    newTab.id = Guid.newGuid();
    newTab.queryResult = null;
    newTab.queryResultStr = '';
    return newTab;
  }

}

