import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MarketProfile } from '../../core/models/market-profile.interface';
import { MarketHistory } from '../../core/models/market-history.interface';
import { TradingSummary } from '../../core/models/trading-summary.interface';

@Injectable({
  providedIn: 'root'
})
export class MarketDetailsService {

  constructor(private httpService: HttpClient) { }

  getMarketDepth(symbol) {
    return this.httpService.get('/marketDepth/' + symbol);
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
    return this.httpService.get<MarketHistory[]>('/symbol/chart-data', { params });
  }

  getTradingSummary(symbol) {
    return this.httpService.get<TradingSummary>('/symbol/trading-summary/' + symbol);
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
