import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MarketDataComponent } from './pages/market-data/market-data.component';
import { SharedModule } from './shared/shared.service';
import { HistoricalComponent } from './pages/historical/historical.component';
import { PageLayoutComponent } from './layouts/page-layout/page-layout.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiInterceptor } from './shared/interceptors/api.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MarketDetailsComponent } from './pages/market-details/market-details.component';
import { MarketDetailsTradingComponent } from './pages/market-details/market-details-trading/market-details-trading.component';
import { MarketDetailsHistoryComponent } from './pages/market-details/market-details-history/market-details-history.component';
import { MarketDetailsProfileComponent } from './pages/market-details/market-details-profile/market-details-profile.component';
import { MarketDetailsMarketDepthComponent } from './pages/market-details/market-details-market-depth/market-details-market-depth.component';
import { NavigationItemComponent } from './components/navigation-item/navigation-item.component';
import { TwoRowComponent } from './components/two-row/two-row.component';
import { MarketDetailsChartComponent } from './pages/market-details/market-details-trading/market-details-chart/market-details-chart.component';
import { HistoricalDataComponent } from './pages/historical/historical-data/historical-data.component';
import { EtfComponent } from './pages/etf/etf.component';
import { RepoMarketComponent } from './pages/repo-market/repo-market.component';
import { RepoHistoricalComponent } from './pages/repo-historical/repo-historical.component';
import { RepoHistoricalDataComponent } from './pages/repo-historical/repo-historical-data/repo-historical-data.component';
import { RepoDetailsComponent } from './pages/repo-details/repo-details.component';
import { RepoTradingComponent } from './pages/repo-details/repo-trading/repo-trading.component';
import { RepoChartComponent } from './pages/repo-details/repo-trading/repo-chart/repo-chart.component';
import { RepoHistoryComponent } from './pages/repo-details/repo-history/repo-history.component';
import { FilterColumnsComponent } from './components/filter-columns/filter-columns.component';
import { MarketDetailsDialogComponent } from './components/market-details-dialog/market-details-dialog.component';
import { ExchangesComponent } from './pages/exchanges/exchanges.component';
import { RateChangeComponent } from './components/rate-change/rate-change.component';
import { FilterDatesComponent } from './components/filter-dates/filter-dates.component';
import { ImportReportsComponent } from './components/import-reports/import-reports.component';
import { HistoricalChartComponent } from './pages/historical/historical-chart/historical-chart.component';
import { HistoricalDialogComponent } from './pages/historical/historical-dialog/historical-dialog.component';
import { FilterHistoricalDatesComponent } from './components/filter-historical-dates/filter-historical-dates.component';

@NgModule({
  declarations: [
    AppComponent,
    MarketDataComponent,
    HistoricalComponent,
    PageLayoutComponent,
    MarketDetailsComponent,
    MarketDetailsTradingComponent,
    MarketDetailsHistoryComponent,
    MarketDetailsProfileComponent,
    MarketDetailsMarketDepthComponent,
    NavigationItemComponent,
    TwoRowComponent,
    MarketDetailsChartComponent,
    HistoricalDataComponent,
    EtfComponent,
    RepoMarketComponent,
    RepoHistoricalComponent,
    RepoHistoricalDataComponent,
    RepoDetailsComponent,
    RepoTradingComponent,
    RepoChartComponent,
    RepoHistoryComponent,
    FilterColumnsComponent,
    MarketDetailsDialogComponent,
    ExchangesComponent,
    RateChangeComponent,
    FilterDatesComponent,
    ImportReportsComponent,
    HistoricalChartComponent,
    HistoricalDialogComponent,
    FilterHistoricalDatesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
