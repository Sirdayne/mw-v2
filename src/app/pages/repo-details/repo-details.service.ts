import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MarketProfile } from '../../core/models/market-profile.interface';
import { MarketHistory } from '../../core/models/market-history.interface';
import { TradingSummary } from '../../core/models/trading-summary.interface';

@Injectable({
  providedIn: 'root'
})
export class RepoDetailsService {

  constructor(private httpService: HttpClient) { }

  getRepoHistory(repoMarket, repoPeriod, dateFrom, dateTo) {
    const payload = { repoMarket, repoPeriod: Number(repoPeriod), dateFrom, dateTo };
    const filter = JSON.stringify(payload);
    const params = { filter };
    return this.httpService.get<MarketHistory[]>('/symbol/historical-specific/repo', { params });
  }

  getRepoChart(secCode, repoPeriod, dateFrom, dateTo) {
    const payload = { dateFrom, dateTo, secCode, repoPeriod };
    const repoChartDataFilter = JSON.stringify(payload);
    const params = { repoChartDataFilter };
    return this.httpService.get<MarketHistory[]>('/symbol/repo-chart-data', { params });
  }

  getRepoTradingSummary(symbol, period) {
    return this.httpService.get<TradingSummary>('/symbol/repo-trading-summary/' + symbol + '/' + period);
  }
}
