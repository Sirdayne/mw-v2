import { Component, OnInit } from '@angular/core';
import { MarketHistory } from '../../../core/models/market-history.interface';
import { FormControl } from '@angular/forms';
import { debounceTime, finalize, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DateTime } from 'luxon';
import { RepoDetailsService } from '../repo-details.service';

@Component({
  selector: 'app-repo-history',
  templateUrl: './repo-history.component.html',
  styleUrls: ['./repo-history.component.css']
})
export class RepoHistoryComponent implements OnInit {
  loading = true;

  displayedColumns = [
    'date',
    'open',
    'high',
    'low',
    'average',
    'close',
    'value',
    'volume'
  ]
  data: MarketHistory[] = [] as MarketHistory[];
  symbol = '';
  period = '';

  now = new Date();
  startDateControl = new FormControl(new Date(this.now.getTime() - 1000 * 60 * 60 * 24 * 7));
  endDateControl = new FormControl(this.now);

  subscription = new Subscription();

  constructor(private route: ActivatedRoute,
              private repoDetailsService: RepoDetailsService) {
    this.onDateControlsChange();
  }

  ngOnInit(): void {
    this.route?.parent?.params.subscribe( params => {
      this.symbol = params['symbol'];
      this.period = params['period'];
      if (this.symbol && this.period) {
        this.getMarketHistory();
      }
    })
  }

  getMarketHistory() {
    this.loading = true;
    this.repoDetailsService.getRepoHistory(this.symbol, this.period,
      DateTime.fromJSDate(this.startDateControl.value).toISODate(),
      DateTime.fromJSDate(this.endDateControl.value).toISODate())
      .pipe(finalize(() => this.loading = false))
      .subscribe((res: MarketHistory[]) => {
        this.data = res ? res : [] as MarketHistory[];
      });
  }

  onDateControlsChange() {
    this.subscription.add(this.endDateControl.valueChanges
      .pipe(debounceTime(250))
      .subscribe((endDate) => {
        if (endDate) {
          this.getMarketHistory();
        }
      }));
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
