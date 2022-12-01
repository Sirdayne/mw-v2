import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MarketDataI } from '../../core/models/market-data.interface';

@Injectable({
  providedIn: 'root'
})
export class MarketDataService {

  constructor(private httpService: HttpClient) { }

  getMarketWatchSummary() {
    return this.httpService.get('/table/mw-summary');
  }

  getMarketWatchRecords() {
    return this.httpService.get<MarketDataI[]>('/table/mw-main-records');
  }
}
