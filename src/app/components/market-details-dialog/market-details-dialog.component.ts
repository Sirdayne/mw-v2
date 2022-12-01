import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

export interface DataMarketDetailsDialog {
  secCode: string;
}

@Component({
  selector: 'app-market-details-dialog',
  templateUrl: './market-details-dialog.component.html',
  styleUrls: ['./market-details-dialog.component.css']
})
export class MarketDetailsDialogComponent implements OnInit {

  inputSymbol: string;

  constructor(public dialogRef: MatDialogRef<MarketDetailsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DataMarketDetailsDialog,
              private router: Router) { }

  ngOnInit(): void {
    this.inputSymbol = this.data.secCode;
  }

  navigateToDetails() {
    this.dialogRef.close();
    this.router.navigateByUrl('/details/' + this.inputSymbol + '/trading');
  }
}
