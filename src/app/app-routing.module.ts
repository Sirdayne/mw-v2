import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MarketDataComponent} from './components/market-data/market-data.component';

const routes: Routes = [
  {
    path: '',
    component: MarketDataComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
