import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {MarketDataService} from './market-data.service';
import {finalize} from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { MarketDataI } from '../../core/models/market-data.interface';
import { Router } from '@angular/router';
import { TableColumn } from '../../core/models/table-column.interface';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MarketDetailsDialogComponent } from '../../components/market-details-dialog/market-details-dialog.component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-market-data',
  templateUrl: './market-data.component.html',
  styleUrls: ['./market-data.component.scss']
})
export class MarketDataComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;

  loading = true;

  displayedColumns: TableColumn[] = [
    {
      value: 'secCode',
      label: 'Symbol',
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
      value: 'state',
      label: 'State',
      show: true
    },
    {
      value: 'referencePrice',
      label: 'Reference Price',
      show: true
    },
    {
      value: 'bidQty',
      label: 'Bid Qty',
      show: true
    },
    {
      value: 'bidPrice',
      label: 'Bid Price',
      show: true
    },
    {
      value: 'offerPrice',
      label: 'Offer Price',
      show: true
    },
    {
      value: 'offerQty',
      label: 'Offer Qty',
      show: true
    },
    {
      value: 'iop',
      label: 'IOP',
      show: true
    },
    {
      value: 'icp',
      label: 'ICP',
      show: true
    },
    {
      value: 'open',
      label: 'Open',
      show: true
    },
    {
      value: 'highPrice',
      label: 'High Price',
      show: true
    },
    {
      value: 'lowPrice',
      label: 'Low Price',
      show: true
    },
    {
      value: 'lastTrade',
      label: 'Last Trade',
      show: true
    },
    {
      value: 'averageWeightedPrice',
      label: 'Average Price',
      show: true
    },
    {
      value: 'previousClose',
      label: 'Previous Close',
      show: true
    },
    {
      value: 'change',
      label: '% Change',
      show: true
    },
    {
      value: 'priceChange',
      label: 'Price Change',
      show: true
    },
    {
      value: 'volume',
      label: 'Volume',
      show: true
    },
    {
      value: 'value',
      label: 'Value',
      show: true
    },
    {
      value: 'numberOfTrades',
      label: 'Number Of Trades',
      show: true
    }
  ]

  data = [] as MarketDataI[];
  dataSource;
  summary = {} as any;

  interval;

  secCodeControl = new FormControl('');
  selectedSecCode;

  constructor(private marketDataService: MarketDataService,
              private router: Router,
              private dialog: MatDialog,
              private decimalPipe: DecimalPipe) { }

  ngOnInit(): void {
    this.fetchData();
    this.interval = setInterval(() => {
      this.fetchData();
    }, 10000)

    this.onSecCodeChanges();
  }

  fetchData() {
    this.getMarketWatchRecords();
    this.getMarketWatchSummary();
  }

  getMarketWatchRecords() {
    this.marketDataService.getMarketWatchRecords().pipe(
      finalize(() => {this.loading = false})
    ).subscribe((res: any) => {
      this.data = res;
      this.setDataSource();
    })
  }

  getMarketWatchSummary() {
    this.marketDataService.getMarketWatchSummary().subscribe((res: any) => {
      this.summary = res;
    })
  }

  onSecCodeChanges() {
    this.secCodeControl.valueChanges.subscribe(res => {
      this.setDataSource();
    })
  }

  setDataSource() {
    const data = this.data.filter(item => item.secCode.toLowerCase().includes(String(this.secCodeControl.value)?.toLowerCase()));
    this.dataSource  = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
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

  navigateToDetails(secCode) {
    this.router.navigateByUrl('/details/' + secCode + '/trading');
  }

  get getDisplayedColumns() {
    return this.displayedColumns.filter(item => item.show).map(item => item.value);
  }

  openDialog(secCode) {
    this.selectedSecCode = secCode;
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
        secCode
      }
    });

    dialogRef.afterClosed().subscribe(() => this.selectedSecCode = null);
  }
}
