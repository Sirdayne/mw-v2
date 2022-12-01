import { Component, OnInit, ViewChild } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { HistoricalResponse, HistoricalService } from './historical.service';
import { FormControl } from '@angular/forms';
import { DateTime } from 'luxon';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TableColumn } from '../../core/models/table-column.interface';
import { ImportService } from '../../shared/import.service';
import { EtfService } from '../etf/etf.service';
import { MarketDetailsDialogComponent } from '../../components/market-details-dialog/market-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HistoricalDialogComponent } from './historical-dialog/historical-dialog.component';

@Component({
  selector: 'app-historical',
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.scss']
})
export class HistoricalComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  loading = true;

  displayedColumns: TableColumn[] = [
    {
      value: 'secCode',
      label: 'Symbol',
      show: true
    },
    {
      value: 'name',
      label: 'Name',
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
      value: 'nav',
      label: 'NAV',
      show: true
    },
    {
      value: 'navCurrency',
      label: 'NAV currency',
      show: true
    },
    {
      value: 'navDetails',
      label: 'NAV details',
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
      value: 'averageWeightedPrice',
      label: 'Average Price',
      show: true
    },
    {
      value: 'closingPrice',
      label: 'Closing Price',
      show: true
    },
    {
      value: 'previousClose',
      label: 'Previous Close',
      show: true
    },
    {
      value: 'percentChange',
      label: '% Change',
      show: true
    },
    {
      value: 'priceChange',
      label: 'Price Change',
      show: true
    },
    {
      value: 'accruedInterest',
      label: 'Accrued Interest',
      show: true
    },
    {
      value: 'value',
      label: 'Value',
      show: true
    },
    {
      value: 'numberOfTrades',
      label: 'Number of Trades',
      show: true
    },
  ]

  data;
  dataSource;
  summary = {} as any;

  maxDate = DateTime.local().minus({ days: 1 }).toJSDate();
  dateControl = new FormControl(this.maxDate);
  subscription = new Subscription();

  secCodeControl = new FormControl('');
  selectedSecCode;

  constructor(private historicalService: HistoricalService,
              private importService: ImportService,
              private etfService: EtfService,
              private router: Router,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.getHistoricalTableData();
    this.onDateChanges();
    this.onSecCodeChanges();
  }

  onDateChanges() {
    this.subscription.add(
      this.dateControl.valueChanges.subscribe(res => {
        if (res) {
          this.getHistoricalTableData();
        }
      })
    )
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

  getHistoricalTableData() {
    this.loading = true;
    this.historicalService.getHistoricalTableData(DateTime.fromJSDate(this.dateControl.value).toISODate()).pipe(
      finalize(() => {this.loading = false})
    ).subscribe((res: HistoricalResponse) => {
      this.summary = res;
      this.data = res.historicalTableRows;
      this.setDataSource();
    })
  }

  isValue(value) {
    return value ? value : '-';
  }

  ngOnDestroy() {
    this.removeInterval();
  }

  removeInterval() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  navigateToDetails(secCode) {
    this.router.navigateByUrl('/details/' + secCode + '/trading');
  }

  downloadNavDetails(fileId, fileName) {
    this.etfService.downloadNavDetails(fileId).subscribe(res => {
      this.importService.saveFile(fileName, res, 'pdf');
    })
  }

  get getDisplayedColumns() {
    return this.displayedColumns.filter(item => item.show).map(item => item.value);
  }

  downloadReport(type) {
    if (this.dateControl && this.dateControl.value) {
      this.historicalService.downloadReport(type, this.dateControl.value).subscribe(res => {
        this.importService.saveFile('historical', res, type);
      });
    }
  }

  openDialog(secCode) {
    this.selectedSecCode = secCode;
    const dialogRef = this.dialog.open(HistoricalDialogComponent, {
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
        date: this.dateControl && this.dateControl.value ? this.dateControl.value : null
      }
    });

    dialogRef.afterClosed().subscribe(() => this.selectedSecCode = null);
  }
}
