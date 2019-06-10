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

  public constructor(title?: string) {
    super();
    this.title = title || 'SPARQL';
    this.query = 'select * where { ?s a owl:Ontology. }';
    this.endpoint = 'https://query.wikidata.org/sparql';
    this.queryResult = null;
    this.queryResultStr = '';
    this.history = [];
  }

}

