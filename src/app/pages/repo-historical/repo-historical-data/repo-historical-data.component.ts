import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  RepoHistoricalDataResponse,
  RepoHistoricalDataTableRow,
  RepoHistoricalService
} from '../repo-historical.service';
import { debounceTime, finalize, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { DateTime } from 'luxon';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DecimalPipe } from '@angular/common';
import { ImportService } from '../../../shared/import.service';

@Component({
  selector: 'app-repo-historical-data',
  templateUrl: './repo-historical-data.component.html',
  styleUrls: ['./repo-historical-data.component.css']
})
export class RepoHistoricalDataComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  loading = true;

  displayedColumns = [
    'repoMarket',
    'repoPeriod',
    'numberOfTrades',
    'totalValue',
    'totalVolume'
  ]

  data;
  summary = {} as any;

  now = new Date();
  startDateControl = new FormControl(new Date(this.now.getTime() - 1000 * 60 * 60 * 24 * 7));
  endDateControl = new FormControl(this.now);
  subscription = new Subscription();

  constructor(private repoHistoricalService: RepoHistoricalService,
              private decimalPipe: DecimalPipe,
              private importService: ImportService) {
  }

  ngOnInit(): void {
    this.getRepoPeriodical();
    this.onDateControlsChange();
  }

  onDateControlsChange() {
    this.subscription.add(this.endDateControl.valueChanges
      .pipe(debounceTime(250))
      .subscribe((endDate) => {
        if (endDate) {
          this.getRepoPeriodical();
        }
      }));
  }

  getRepoPeriodical() {
    this.loading = true;
    this.repoHistoricalService.getRepoPeriodicalTableData(
      DateTime.fromJSDate(this.startDateControl.value).toISODate(),
      DateTime.fromJSDate(this.endDateControl.value).toISODate()
    ).pipe(
      finalize(() => {
        this.loading = false
      })
    ).subscribe((res: RepoHistoricalDataResponse) => {
      this.data  = new MatTableDataSource(res.tableRows);
      this.data.sort = this.sort;
      this.setSummary(res);
    })
  }

  setSummary(res) {
    this.summary.currentPeriodValueSum = res.currentPeriodValueSum;
    this.summary.currentPeriodVolumeSum = res.currentPeriodVolumeSum;
  }

  isValue(value) {
    if (value && typeof value === 'number') {
      return this.decimalPipe.transform(value, '1.' );
    }
    return value ? value : '-';
  }

  downloadReport(type) {
    if ((this.startDateControl && this.startDateControl.value) &&
      (this.endDateControl && this.endDateControl.value)) {
      this.repoHistoricalService.downloadHistoricalDataReport(type,
        DateTime.fromJSDate(this.startDateControl.value).toISODate(),
        DateTime.fromJSDate(this.endDateControl.value).toISODate()).subscribe(res => {
        this.importService.saveFile('repoPeriodical', res, type);
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
