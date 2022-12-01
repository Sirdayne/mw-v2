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
  symbol = '';
  tradingSummary: TradingSummary;
  loading = true;

  constructor(private marketDetailsService: MarketDetailsService,
              private route: ActivatedRoute,
              public datePipe: DatePipe) { }

  ngOnInit(): void {
    this.route?.parent?.params.subscribe( params => {
      this.symbol = params['symbol'];
      if (this.getSymbol) {
        this.getTradingSummary();
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.inputSymbol && changes.inputSymbol.currentValue) {
      this.getTradingSummary();
    }
  }

  getTradingSummary() {
    this.loading = true;
    this.marketDetailsService.getTradingSummary(this.getSymbol)
      .pipe(finalize(() => this.loading = false))
      .subscribe((res: TradingSummary) => {
        this.tradingSummary = res ? res : {} as TradingSummary;
      });
  }

  get getSymbol() {
    return this.inputSymbol ? this.inputSymbol : this.symbol;
  }

}
