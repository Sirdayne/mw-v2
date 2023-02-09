import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RepoMarketI } from '../../core/models/repo-market.interface';

export interface RepoHistoricalResponse {
  dailyValueSum: number;
  dailyValueSumUSD: number;
  dailyVolumeSum: number;
  dataDate: string;
  repoHistoricalTableRows: RepoMarketI[]
  numberOfTradesSum: number;
}

export interface RepoHistoricalDataResponse {
  currentPeriodValueSum: number;
  currentPeriodVolumeSum: number;
  repoPeriodicalDataFilter: RepoPeriodicalDataFilter;
  dateFrom: string;
  dateTo: string
  tableRows: RepoHistoricalDataTableRow[];
}

export interface RepoPeriodicalDataFilter {
  currencyValue: object;
  dateFrom: string;
  dateTo: string;
}

export interface RepoHistoricalDataTableRow {
  repoMarket: string;
  repoPeriod: number;
  totalVolume: number;
  totalValue: number;
  numberOfTrades: number;
}

@Injectable({
  providedIn: 'root'
})
export class RepoHistoricalService {

  constructor(private httpService: HttpClient) { }

  getRepoHistoricalTableData(date) {
    const payload = { date };
    // const payload = { assetClass: 'ALL', date: null };
    const repoHistoricalDataFilter = JSON.stringify(payload);
    const params = { repoHistoricalDataFilter };
    return this.httpService.get<RepoHistoricalResponse>('/historical/repo-table-data', { params });
  }

  getRepoPeriodicalTableData(dateFrom, dateTo) {
    const payload = { dateFrom, dateTo };
    const filter = JSON.stringify(payload);
    const params = { filter };
    return this.httpService.get<RepoHistoricalDataResponse>('/periodical/repo-data', { params });
  }

  downloadReport(type, date) {
    const payload = { date, assetClass: 'ALL' };
    const filter = JSON.stringify(payload);
    const params = { type, filter };
    return this.httpService.get('/historical/repo-report', { params, responseType: 'blob' });
  }

  downloadHistoricalDataReport(
    type,
    dateFrom, dateTo
  ) {
    const payload = { dateFrom, dateTo };
    const filter = JSON.stringify(payload);
    const params = { type, filter };
    return this.httpService.get('/periodical/repo-report', { params, responseType: 'blob' });
  }
}
