import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MarketDataService {

  constructor(private httpService: HttpClient) { }

  getMarketWatchSummary() {
    return this.httpService.get('/table/mw-summary');
  }

  getMarketWatchRecords() {
    return this.httpService.get('/table/mw-main-records');
  }
}
