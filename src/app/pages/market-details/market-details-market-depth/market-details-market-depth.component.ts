import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MarketDetailsService } from '../market-details.service';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-market-details-market-depth',
  templateUrl: './market-details-market-depth.component.html',
  styleUrls: ['./market-details-market-depth.component.css']
})
export class MarketDetailsMarketDepthComponent implements OnInit, OnChanges, OnDestroy {
  @Input() inputSymbol;
  symbol: string | null = null;
  bidRows;
  offerRows;

  displayedColumnsBid = ['orderNumber', 'volume', 'price'];
  displayedColumnsOffer = ['price', 'volume', 'orderNumber'];
  interval;

  constructor(private marketDetailsService: MarketDetailsService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route?.parent?.params.subscribe( params => {
      this.symbol = params['symbol'];
      if (this.getSymbol) {
        this.getMarketDepth();
        this.interval = setInterval(() => {
          this.getMarketDepth();
        }, 10000);
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.inputSymbol && changes.inputSymbol.currentValue) {
      this.getMarketDepth();
    }
  }

  getMarketDepth() {
    this.marketDetailsService.getMarketDepth(this.getSymbol)
      .subscribe((res: any) => {
      if (res) {
        this.bidRows = res && res.bidRows ? res.bidRows : [];
        this.offerRows = res && res.offerRows ? res.offerRows : [];
        this.equalizeTables();
        this.pushSums(res);
      }
    })
  }

  pushSums(res) {
    const bidSum = {
      orderNumber: res && res.bidOrderSum ? res.bidOrderSum : null,
      volume: res && res.bidVolumeSum ? res.bidVolumeSum : null,
      price: null,
      sum: true
    }
    this.bidRows.push(bidSum)
    const offerSum = {
      orderNumber: res && res.offerOrderSum ? res.offerOrderSum : null,
      volume: res && res.offerVolumeSum ? res.offerVolumeSum : null,
      price: null,
      sum: true
    }
    this.offerRows.push(offerSum);
  }

  equalizeTables() {
    const bidRowsLength = this.bidRows.length ? this.bidRows.length : 0;
    const offerRowsLength = this.offerRows.length ? this.offerRows.length : 0;
    let numOfRows = bidRowsLength - offerRowsLength;
    numOfRows = numOfRows < 0 ? numOfRows * (-1) : numOfRows;
    const array = bidRowsLength < offerRowsLength ? this.bidRows : this.offerRows;
    for (let i = 0; i < numOfRows; i++) {
      array.push({});
    }
  }

  get getSymbol() {
    return this.inputSymbol ? this.inputSymbol : this.symbol;
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
