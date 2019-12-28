import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppReducers, AppEffects } from './store/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AngularSplitModule } from 'angular-split';
import { environment } from '../environments/environment';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { SparqlService } from './services/sparql.service';
import { LocalStorageService } from './services/localstorage.service';

import 'codemirror/mode/sparql/sparql';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/format/formatting';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(AppReducers),
    EffectsModule.forRoot(AppEffects),
    AngularSplitModule.forRoot(),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    SharedModule,
    CoreModule,
  ],
  providers: [SparqlService, LocalStorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
