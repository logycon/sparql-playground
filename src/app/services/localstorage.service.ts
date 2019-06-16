import { Injectable } from '@angular/core';
import { SparqlTab } from '../models/tabs';


@Injectable()
export class LocalStorageService {
  private static KEY = 'sparqlTabs';

  public saveSparqlTabs(tabs: SparqlTab[]): void {
    if (localStorage) {
      localStorage.setItem(LocalStorageService.KEY,  JSON.stringify(tabs));
    } else {
      console.error('localStorage is not available');
    }
  }

  public loadSparqlTabs(): SparqlTab[] {
    if (localStorage) {
      return JSON.parse(localStorage.getItem(LocalStorageService.KEY)) || [];
    } else {
      return [];
    }
  }
}
