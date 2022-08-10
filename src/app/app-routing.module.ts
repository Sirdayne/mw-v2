import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketDataComponent } from './components/market-data/market-data.component';
import { HistoricalComponent } from './components/historical/historical.component';
import { PageLayoutComponent } from './layouts/page-layout/page-layout.component';

const childrenRoutes: Routes = [
  {
    path: '',
    component: MarketDataComponent
  },
  {
    path: 'historical',
    component: HistoricalComponent
  }
];

const routes: Routes = [
  {
    path: '',
    component: PageLayoutComponent,
    children: childrenRoutes
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
