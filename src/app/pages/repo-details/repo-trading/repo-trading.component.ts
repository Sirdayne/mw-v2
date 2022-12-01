import { Component, OnInit } from '@angular/core';
import { TradingSummary } from '../../../core/models/trading-summary.interface';
import { RepoDetailsService } from '../repo-details.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-repo-trading',
  templateUrl: './repo-trading.component.html',
  styleUrls: ['./repo-trading.component.css']
})
export class RepoTradingComponent implements OnInit {
  symbol = '';
  period = '';
  tradingSummary: TradingSummary;
  loading = true;

  constructor(private repoDetailsService: RepoDetailsService,
              private route: ActivatedRoute,
              public datePipe: DatePipe) { }

  ngOnInit(): void {
    this.route?.parent?.params.subscribe( params => {
      this.symbol = params['symbol'];
      this.period = params['period'];
      if (this.period && this.symbol) {
        this.getRepoTradingSummary();
      }
    })
  }

  getRepoTradingSummary() {
    this.loading = true;
    this.repoDetailsService.getRepoTradingSummary(this.symbol, this.period)
      .pipe(finalize(() => this.loading = false))
      .subscribe((res: TradingSummary) => {
        this.tradingSummary = res ? res : {} as TradingSummary;
      });
  }
}
