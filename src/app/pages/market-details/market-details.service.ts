import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MarketProfile } from '../../core/models/market-profile.interface';
import { MarketHistory } from '../../core/models/market-history.interface';
import { TradingSummary } from '../../core/models/trading-summary.interface';
import { ChartNav, ChartPoint } from '../../core/models/chart.interface';

@Injectable({
  providedIn: 'root'
})
export class MarketDetailsService {

  constructor(private httpService: HttpClient) { }

  getMarketDepth(symbol) {
    return this.httpService.get('/marketDepth/' + symbol);
  }

  getRepoMarketDepth(symbol, reporPeriod) {
    return this.httpService.get('/repoMarketDepth/' + symbol + '/' + reporPeriod);
  }

  getMarketProfile(symbol) {
    return this.httpService.get<MarketProfile>('/profile/' + symbol);
  }

  getMarketHistory(secCode, dateFrom, dateTo) {
    const payload = { secCode, dateFrom, dateTo };
    const filter = JSON.stringify(payload);
    const params = { filter };
    return this.httpService.get<MarketHistory[]>('/symbol/historical-specific/', { params });
  }

  getMarketChart(secCode, dateFrom, dateTo) {
    const payload = { secCode, dateFrom, dateTo };
    const chartDataFilter = JSON.stringify(payload);
    const params = { chartDataFilter };
    return this.httpService.get<ChartPoint[]>('/symbol/chart-data', { params });
  }

  getRepoMarketChart(secCode, repoPeriod, dateFrom, dateTo) {
    const payload = { secCode, repoPeriod, dateFrom, dateTo };
    const repoChartDataFilter = JSON.stringify(payload);
    const params = { repoChartDataFilter };
    return this.httpService.get<ChartPoint[]>('/symbol/repo-chart-data', { params });
  }

  getNavChart(secCode, dateFrom, dateTo) {
    const payload = { secCode, dateFrom, dateTo };
    const chartDataFilter = JSON.stringify(payload);
    const params = { chartDataFilter };
    return this.httpService.get<ChartNav[]>('/symbol/nav-chart-data', { params });
  }

  getTradingSummary(symbol) {
    return this.httpService.get<TradingSummary>('/symbol/trading-summary/' + symbol);
  }

  getRepoTradingSummary(symbol, repoMarket) {
    return this.httpService.get<TradingSummary>('/symbol/repo-trading-summary/' + symbol + '/' + repoMarket);
  }

  downloadHistoryReport(
    type, secCode,
    dateFrom, dateTo
  ) {
    const payload = { secCode, dateFrom, dateTo };
    const filter = JSON.stringify(payload);
    const params = { type, filter };
    return this.httpService.get('/symbol/historical-specific/report', { params, responseType: 'blob' });
  }
}
