import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { RepoHistoricalResponse, RepoHistoricalService } from './repo-historical.service';
import { FormControl } from '@angular/forms';
import { DateTime } from 'luxon';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TableColumn } from '../../core/models/table-column.interface';

@Component({
  selector: 'app-repo-historical',
  templateUrl: './repo-historical.component.html',
  styleUrls: ['./repo-historical.component.css']
})
export class RepoHistoricalComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  loading = true;

  displayedColumns: TableColumn[] = [
    {
      value: 'repoMarket',
      label: 'Repo Market',
      show: true
    },
    {
      value: 'repoPeriod',
      label: 'Repo period',
      show: true
    },
    {
      value: 'currency',
      label: 'Currency',
      show: true
    },
    {
      value: 'assetClass',
      label: 'Asset Class',
      show: true
    },
    {
      value: 'referencePrice',
      label: 'Reference Price',
      show: true
    },
    {
      value: 'haircut',
      label: 'Haircut',
      show: true
    },
    {
      value: 'repoPrice',
      label: 'Repo Price',
      show: true
    },
    {
      value: 'openRepoRate',
      label: 'Open Repo Rate',
      show: true
    },
    {
      value: 'highRepoRate',
      label: 'High Repo Rate',
      show: true
    },
    {
      value: 'lowRepoRate',
      label: 'Low Repo Rate',
      show: true
    },
    {
      value: 'lastRepoRate',
      label: 'Last Repo Rate',
      show: true
    },
    {
      value: 'previousCloseRepoRate',
      label: 'Previous Close Repo Rate',
      show: true
    },
    {
      value: 'repoRateChange',
      label: 'Repo Rate Change',
      show: true
    },
    {
      value: 'dailyVolume',
      label: 'Daily Volume',
      show: true
    },
    {
      value: 'dailyValue',
      label: 'Daily Value',
      show: true
    },
    {
      value: 'numberOfTrades',
      label: 'Numnber Of Trades',
      show: true
    },
  ]

  dataSource;
  data;
  summary = {} as any;

  maxDate = DateTime.local().minus({ days: 1 }).toJSDate();
  dateControl = new FormControl(this.maxDate);
  subscription = new Subscription();

  constructor(private repoHistoricalService: RepoHistoricalService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.getRepoHistorical();
    this.onDateChanges();
  }

  onDateChanges() {
    this.subscription.add(
      this.dateControl.valueChanges.subscribe(res => {
        if (res) {
          this.getRepoHistorical();
        }
      })
    )
  }

  getRepoHistorical() {
    this.loading = true;
    this.repoHistoricalService.getRepoHistoricalTableData(DateTime.fromJSDate(this.dateControl.value).toISODate()).pipe(
      finalize(() => {
        this.loading = false
      })
    ).subscribe((res: RepoHistoricalResponse) => {
      this.data  = res.repoHistoricalTableRows;
      this.setDataSource();
    })
  }

  setDataSource() {
    this.dataSource  = new MatTableDataSource(this.data);
    this.dataSource.sort = this.sort;
  }

  isValue(value) {
    return value ? value : '-';
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  navigateToDetails(repoMarket, repoPeriod) {
    this.router.navigateByUrl('/repo-details/' + repoMarket + '/' + repoPeriod + '/trading');
  }

  get getDisplayedColumns() {
    return this.displayedColumns.filter(item => item.show).map(item => item.value);
  }
}
