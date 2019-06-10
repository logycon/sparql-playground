import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SparqlTabComponent } from './tabs/sparqltab/sparqltab.component';
import { AngularSplitModule } from 'angular-split';
import { SharedModule } from './../shared/shared.module';

@NgModule({
  declarations: [ HeaderComponent, FooterComponent, SparqlTabComponent ],
  imports: [
    CommonModule,
    FormsModule,
    AngularSplitModule,
    SharedModule
  ],
  exports: [ HeaderComponent, FooterComponent, SparqlTabComponent ]
})
export class CoreModule { }
