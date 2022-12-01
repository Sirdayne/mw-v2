import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HistoricalService, PeriodicalResponse } from '../historical.service';
import { debounceTime, finalize, merge, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { DateTime } from 'luxon';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ImportService } from '../../../shared/import.service';

@Component({
  selector: 'app-historical-data',
  templateUrl: './historical-data.component.html',
  styleUrls: ['./historical-data.component.css']
})
export class HistoricalDataComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  loading = true;

  displayedColumns = [
    'symbol',
    'numberOfTrades',
    'currentPeriodValue',
    'currentPeriodMarketShare',
    'lastPeriodValue',
    'lastPeriodMarketShare',
    'trendValue',
    'trendMarketShare',
  ]

  data;
  summary = {} as any;

  now = new Date();
  currentStartDateControl = new FormControl(new Date(this.now.getTime() - 1000 * 60 * 60 * 24 * 6));
  currentEndDateControl = new FormControl(this.now);

  lastStartDateControl = new FormControl(new Date(this.now.getTime() - 1000 * 60 * 60 * 24 * 13));
  lastEndDateControl = new FormControl(new Date(this.now.getTime() - 1000 * 60 * 60 * 24 * 7));
  subscription = new Subscription();

  constructor(private historicalService: HistoricalService,
              private importService: ImportService,
              private router: Router) { }

  ngOnInit(): void {
    this.getHistoricalTableData();
    this.onDateControlsChange();
  }

  onDateControlsChange() {
    this.subscription.add(
      merge(
        this.currentEndDateControl.valueChanges,
        this.lastEndDateControl.valueChanges
      )
      .pipe(debounceTime(250))
      .subscribe((endDate) => {
        if (endDate) {
          this.getHistoricalTableData();
        }
      }));
  }

  getHistoricalTableData() {
    this.loading = true;
    this.historicalService.getPeriodicalTableData(
      DateTime.fromJSDate(this.currentStartDateControl.value).toISODate(),
      DateTime.fromJSDate(this.currentEndDateControl.value).toISODate(),
      DateTime.fromJSDate(this.lastStartDateControl.value).toISODate(),
      DateTime.fromJSDate(this.lastEndDateControl.value).toISODate()
    )
      .pipe(
      finalize(() => {this.loading = false})
    ).subscribe((res: PeriodicalResponse) => {
      this.summary = res;
      this.data  = new MatTableDataSource(res.tableRows);
      this.data.sort = this.sort;
    })
  }

  isValue(value) {
    return value ? value : '-';
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  navigateToDetails(secCode) {
    this.router.navigateByUrl('/details/' + secCode + '/trading');
  }

  downloadReport(type) {
    if ((this.currentStartDateControl && this.currentStartDateControl.value) &&
       (this.currentEndDateControl && this.currentEndDateControl.value) &&
       (this.lastStartDateControl && this.lastStartDateControl.value) &&
       (this.lastEndDateControl && this.lastEndDateControl.value)) {
      this.historicalService.downloadHistoricalDataReport(type,
        DateTime.fromJSDate(this.currentStartDateControl.value).toISODate(),
        DateTime.fromJSDate(this.currentEndDateControl.value).toISODate(),
        DateTime.fromJSDate(this.lastStartDateControl.value).toISODate(),
        DateTime.fromJSDate(this.lastEndDateControl.value).toISODate()).subscribe(res => {
        this.importService.saveFile('periodical', res, type);
      });
    }
  }
}
