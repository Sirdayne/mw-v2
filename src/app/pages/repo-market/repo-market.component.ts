import { Component, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { RepoMarketService } from './repo-market.service';
import { RepoMarketI } from '../../core/models/repo-market.interface';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TableColumn } from '../../core/models/table-column.interface';
import { DecimalPipe } from '@angular/common';
import { MarketDetailsDialogComponent } from '../../components/market-details-dialog/market-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-repo-market',
  templateUrl: './repo-market.component.html',
  styleUrls: ['./repo-market.component.css']
})
export class RepoMarketComponent implements OnInit {
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
    {
      value: 'state',
      label: 'State',
      show: true
    },
  ]

  dataSource;
  data;
  summary = {} as any;

  interval;
  selectedRepoMarket;

  constructor(private repoMarketService: RepoMarketService,
              private router: Router,
              private decimalPipe: DecimalPipe,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchData();
    this.interval = setInterval(() => {
      this.fetchData();
    }, 10000)
  }

  fetchData() {
    this.getRepoMarketRecords();
    this.getRepoMarketSummary();
  }

  getRepoMarketRecords() {
    this.repoMarketService.getRepoMarketRecords().pipe(
      finalize(() => {this.loading = false})
    ).subscribe((res: RepoMarketI[]) => {
      this.data  = res;
      this.setDataSource();
    })
  }

  setDataSource() {
    this.dataSource  = new MatTableDataSource(this.data);
    this.dataSource.sort = this.sort;
  }

  getRepoMarketSummary() {
    this.repoMarketService.getRepoMarketSummary().subscribe((res: any) => {
      if (res && res.length > 0) {
        this.setSummary(res);
      }
    })
  }

  setSummary(res) {
    const marketState = res.find(item => item.code === 'MarketState');
    this.summary.marketState = marketState && marketState.value ? marketState.value : '-';

    const numberOfTrades = res.find(item => item.code === 'TotalTrades');
    this.summary.numberOfTrades = numberOfTrades && numberOfTrades.value ? numberOfTrades.value : '-';

    const volume = res.find(item => item.code === 'TotalVolume');
    this.summary.volume = volume && volume.value ? volume.value : '-';

    const totalValue = res.find(item => item.code === 'TotalValue');
    this.summary.totalValue = totalValue && totalValue.value ? totalValue.value : '-';
  }

  isValue(value) {
    if (value && typeof value === 'number') {
      return this.decimalPipe.transform(value, '1.' );
    }
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

  navigateToDetails(repoMarket, repoPeriod) {
    this.router.navigateByUrl('/repo-details/' + repoMarket + '/' + repoPeriod + '/trading');
  }

  get getDisplayedColumns() {
    return this.displayedColumns.filter(item => item.show).map(item => item.value);
  }

  openDialog(secCode, repoPeriod) {
    this.selectedRepoMarket = secCode + repoPeriod;
    const dialogRef = this.dialog.open(MarketDetailsDialogComponent, {
      maxWidth: '50vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      position: {
        top: '0',
        right: '0'
      },
      enterAnimationDuration: '10ms',
      data: {
        secCode,
        repoPeriod
      }
    });

    dialogRef.afterClosed().subscribe(() => this.selectedRepoMarket = null);
  }
}

