import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MarketDataComponent} from './components/market-data/market-data.component';
import {HistoricalComponent} from './components/historical/historical.component';

const routes: Routes = [
  {
    path: '',
    component: MarketDataComponent
  },
  {
    path: 'historical',
    component: HistoricalComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
