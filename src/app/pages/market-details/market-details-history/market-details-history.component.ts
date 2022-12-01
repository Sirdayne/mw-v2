import { Component, OnDestroy, OnInit } from '@angular/core';
import { MarketDetailsService } from '../market-details.service';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, finalize, Subscription } from 'rxjs';
import { MarketHistory } from '../../../core/models/market-history.interface';
import { FormControl } from '@angular/forms';
import { DateTime } from 'luxon';
import { ImportService } from '../../../shared/import.service';

@Component({
  selector: 'app-market-details-history',
  templateUrl: './market-details-history.component.html',
  styleUrls: ['./market-details-history.component.css']
})
export class MarketDetailsHistoryComponent implements OnInit, OnDestroy {
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

  now = new Date();
  startDateControl = new FormControl(new Date(this.now.getTime() - 1000 * 60 * 60 * 24 * 7));
  endDateControl = new FormControl(this.now);

  subscription = new Subscription();

  constructor(private route: ActivatedRoute,
              private marketDetailsService: MarketDetailsService,
              private importService: ImportService) {
    this.onDateControlsChange();
  }

  ngOnInit(): void {
    this.route?.parent?.params.subscribe( params => {
      this.symbol = params['symbol'];
      if (this.symbol) {
        this.getMarketHistory();
      }
    })
  }

  getMarketHistory() {
    this.loading = true;
    this.marketDetailsService.getMarketHistory(this.symbol,
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

  setPeriod(startDate) {
    this.startDateControl.patchValue(startDate);
    this.endDateControl.patchValue(this.now);
  }

  downloadReport(type) {
    if (this.startDateControl && this.startDateControl.value &&
        this.endDateControl && this.endDateControl.value) {
      this.marketDetailsService.downloadHistoryReport(type, this.symbol, this.startDateControl.value, this.endDateControl.value).subscribe(res => {
        this.importService.saveFile('history', res, type);
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
