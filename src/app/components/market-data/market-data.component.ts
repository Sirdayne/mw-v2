import {Component, OnDestroy, OnInit} from '@angular/core';
import {MarketDataService} from './market-data.service';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-market-data',
  templateUrl: './market-data.component.html',
  styleUrls: ['./market-data.component.scss']
})
export class MarketDataComponent implements OnInit, OnDestroy {
  loading = true;

  displayedColumns = [
    'symbol',
    'currency',
    'assetClass',
    'state',
    'bidQty',
    'bidPrice',
    'offerPrice',
    'offerQty',
    'iop',
    'icp',
    'highPrice',
    'lowPrice',
    'lastTrade',
    'averagePrice',
    'previousClose',
    'change',
    'priceChange',
    'volume',
    'value',
    'numberOfTrades'
  ]

  data = [];
  summary = {} as any;

  interval;

  constructor(private marketDataService: MarketDataService) { }

  ngOnInit(): void {
    this.fetchData();
    this.interval = setInterval(() => {
      this.fetchData();
    }, 10000)
  }

  fetchData() {
    this.getMarketWatchRecords();
    this.getMarketWatchSummary();
  }

  getMarketWatchRecords() {
    this.marketDataService.getMarketWatchRecords().pipe(
      finalize(() => {this.loading = false})
    ).subscribe((res: any) => {
      this.data = res;
    })
  }

  getMarketWatchSummary() {
    this.marketDataService.getMarketWatchSummary().subscribe((res: any) => {
      console.log(res, ' mw summary');
      this.summary = res;
    })
  }

  isValue(value) {
    return value ? value : '-';
  }

  ngOnDestroy() {
    this.removeInterval();
  }

  removeInterval() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
