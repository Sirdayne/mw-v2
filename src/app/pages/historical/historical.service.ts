import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HistoricalI } from '../../core/models/historical.interface';
import { HistoricalDataI } from '../../core/models/historical-data.interface';
import { MarketHistory } from '../../core/models/market-history.interface';

export interface HistoricalResponse {
  dailyValueSum: number;
  dailyValueSumUSD: number;
  dailyVolumeSum: number;
  dataDate: string;
  historicalTableRows: HistoricalI[]
  numberOfTradesSum: number;
}

export interface PeriodicalDataFilter {
  currentDateFrom: string;
  currentDateTo: string;
}

export interface PeriodicalResponse {
  currentPeriodValueSum: number;
  lastPeriodValueSum: number;
  periodicalDataFilter: PeriodicalDataFilter;
  tableRows: HistoricalDataI[];
  trendMarketShareSum: number;
  trendValueSum: number;
}

@Injectable({
  providedIn: 'root'
})
export class HistoricalService {

  constructor(private httpService: HttpClient) { }

  getHistoricalTableData(date) {
    const payload = { date };
    // const payload = { assetClass: 'ALL', date: null };
    const historicalDataFilter = JSON.stringify(payload);
    const params = { historicalDataFilter };
    return this.httpService.get<HistoricalResponse>('/historical/table-data', { params });
  }

  getPeriodicalTableData(currentDateFrom, currentDateTo,
                         lastDateFrom, lastDateTo) {
    const payload = { currentDateFrom, currentDateTo, lastDateFrom, lastDateTo };
    const filter = JSON.stringify(payload);
    const params = { filter };
    return this.httpService.get<PeriodicalResponse>('/periodical/data', { params });
  }

  downloadReport(type, date) {
    const payload = { date };
    const filter = JSON.stringify(payload);
    const params = { type, filter };
    return this.httpService.get('/historical/report', { params, responseType: 'blob' });
  }

  downloadHistoricalDataReport(
    type,
    currentDateFrom, currentDateTo,
    lastDateFrom, lastDateTo
  ) {
    const payload = { currentDateFrom, currentDateTo, lastDateFrom, lastDateTo };
    const filter = JSON.stringify(payload);
    const params = { type, filter };
    return this.httpService.get('/periodical/report', { params, responseType: 'blob' });
  }

  getHistoricalChart(secCode, date) {
    const payload = { secCode, date };
    const historicalChartDataFilter = JSON.stringify(payload);
    const params = { historicalChartDataFilter };
    return this.httpService.get<MarketHistory[]>('/historical/chart-for-security-data', { params });
  }
}
