import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SparqlTabComponent } from './core/tabs/sparqltab/sparqltab.component';
import { AppRoute } from './models/enums/app-route';

const routes: Routes = [
  { path : AppRoute.HOME, component: SparqlTabComponent },
  { path: '', redirectTo: AppRoute.HOME , pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
