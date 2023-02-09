import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MarketDetailsService } from '../market-details.service';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { TradingSummary } from '../../../core/models/trading-summary.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-market-details-trading',
  templateUrl: './market-details-trading.component.html',
  styleUrls: ['./market-details-trading.component.css']
})
export class MarketDetailsTradingComponent implements OnInit, OnChanges {
  @Input() inputSymbol;
  @Input() inputRepoMarket;
  symbol = '';
  tradingSummary: TradingSummary;
  isEtf = false;
  loading = true;

  constructor(private marketDetailsService: MarketDetailsService,
              private route: ActivatedRoute,
              public datePipe: DatePipe) { }

  ngOnInit(): void {
    this.route?.parent?.params.subscribe( params => {
      this.symbol = params['symbol'];
      if (this.getSymbol) {
        this.fetchTradingSummary();
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.inputSymbol && changes.inputSymbol.currentValue) {
      this.fetchTradingSummary();
    }
  }

  fetchTradingSummary() {
    this.loading = true;
    if (this.inputRepoMarket) {
      this.getRepoTradingSummary();
    } else {
      this.getTradingSummary();
    }
  }

  getRepoTradingSummary() {
    this.marketDetailsService.getRepoTradingSummary(this.getSymbol, this.inputRepoMarket)
      .pipe(finalize(() => this.loading = false))
      .subscribe((res: TradingSummary) => {
        this.tradingSummary = res ? res : {} as TradingSummary;
        this.isEtf = this.tradingSummary.isEtfEtn;
      });
  }

  getTradingSummary() {
    this.marketDetailsService.getTradingSummary(this.getSymbol)
      .pipe(finalize(() => this.loading = false))
      .subscribe((res: TradingSummary) => {
        this.tradingSummary = res ? res : {} as TradingSummary;
        this.isEtf = this.tradingSummary.isEtfEtn;
      });
  }

  get getSymbol() {
    return this.inputSymbol ? this.inputSymbol : this.symbol;
  }

}
