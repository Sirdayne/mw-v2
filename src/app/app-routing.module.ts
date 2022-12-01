import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketDataComponent } from './pages/market-data/market-data.component';
import { HistoricalComponent } from './pages/historical/historical.component';
import { PageLayoutComponent } from './layouts/page-layout/page-layout.component';
import { MarketDetailsComponent } from './pages/market-details/market-details.component';
import { MarketDetailsTradingComponent } from './pages/market-details/market-details-trading/market-details-trading.component';
import { MarketDetailsHistoryComponent } from './pages/market-details/market-details-history/market-details-history.component';
import { MarketDetailsProfileComponent } from './pages/market-details/market-details-profile/market-details-profile.component';
import { MarketDetailsMarketDepthComponent } from './pages/market-details/market-details-market-depth/market-details-market-depth.component';
import { EtfComponent } from './pages/etf/etf.component';
import { RepoMarketComponent } from './pages/repo-market/repo-market.component';
import { RepoHistoricalComponent } from './pages/repo-historical/repo-historical.component';
import { RepoDetailsComponent } from './pages/repo-details/repo-details.component';
import { RepoTradingComponent } from './pages/repo-details/repo-trading/repo-trading.component';
import { RepoHistoryComponent } from './pages/repo-details/repo-history/repo-history.component';
import { ExchangesComponent } from './pages/exchanges/exchanges.component';


const marketDetailsRoutes: Routes = [
  {
    path: '',
    component: MarketDetailsTradingComponent
  },
  {
    path: 'trading',
    component: MarketDetailsTradingComponent
  },
  {
    path: 'history',
    component: MarketDetailsHistoryComponent
  },
  {
    path: 'profile',
    component: MarketDetailsProfileComponent
  },
  {
    path: 'market-depth',
    component: MarketDetailsMarketDepthComponent
  },
]

const repoDetailsRoutes: Routes = [
  {
    path: '',
    component: RepoTradingComponent
  },
  {
    path: 'trading',
    component: RepoTradingComponent
  },
  {
    path: 'history',
    component: RepoHistoryComponent
  }
]

const childrenRoutes: Routes = [
  {
    path: '',
    component: MarketDataComponent
  },
  {
    path: 'historical',
    component: HistoricalComponent
  },
  {
    path: 'etf',
    component: EtfComponent
  },
  {
    path: 'repo',
    component: RepoMarketComponent
  },
  {
    path: 'repo-historical',
    component: RepoHistoricalComponent
  },
  {
    path: 'details/:symbol',
    component: MarketDetailsComponent,
    children: marketDetailsRoutes
  },
  {
    path: 'repo-details/:symbol/:period',
    component: RepoDetailsComponent,
    children: repoDetailsRoutes
  },
  {
    path: 'exchanges',
    component: ExchangesComponent
  },
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
