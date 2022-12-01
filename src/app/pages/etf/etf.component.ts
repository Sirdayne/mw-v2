import { Component, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { EtfService } from './etf.service';
import { EtfInterface } from '../../core/models/etf.interface';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { TableColumn } from '../../core/models/table-column.interface';
import { ImportService } from '../../shared/import.service';
import { MarketDetailsDialogComponent } from '../../components/market-details-dialog/market-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-etf',
  templateUrl: './etf.component.html',
  styleUrls: ['./etf.component.css']
})
export class EtfComponent implements OnInit {
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
      value: 'state',
      label: 'State',
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
      label: 'Offet Qty',
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
      value: 'percentChange',
      label: 'Percent Change',
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
    },
  ];

  secCodeControl = new FormControl('');

  data;
  dataSource;
  summary = {} as any;

  interval;
  selectedSecCode;

  constructor(private etfService: EtfService,
              private importService: ImportService,
              private router: Router,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchData();
    this.interval = setInterval(() => {
      this.fetchData();
    }, 10000)

    this.onSecCodeChanges();
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

  fetchData() {
    this.getEtfRecords();
    this.getEtfSummary();
  }

  getEtfRecords() {
    this.etfService.getEtfRecords().pipe(
      finalize(() => {this.loading = false})
    ).subscribe((res: EtfInterface[]) => {
      this.data  = res;
      this.setDataSource();
    })
  }

  getEtfSummary() {
    this.etfService.getEtfSummary().subscribe((res: any) => {
      this.summary = res;
    })
  }

  isValue(value) {
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

  downloadNavDetails(fileId, fileName) {
    this.etfService.downloadNavDetails(fileId).subscribe(res => {
      this.importService.saveFile(fileName, res, 'pdf');
    })
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
