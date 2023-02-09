import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

export interface DataMarketDetailsDialog {
  secCode: string;
  repoPeriod?: string;
}

@Component({
  selector: 'app-market-details-dialog',
  templateUrl: './market-details-dialog.component.html',
  styleUrls: ['./market-details-dialog.component.css']
})
export class MarketDetailsDialogComponent implements OnInit {

  inputSymbol: string;
  inputRepoMarket;

  constructor(public dialogRef: MatDialogRef<MarketDetailsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DataMarketDetailsDialog,
              private router: Router) { }

  ngOnInit(): void {
    this.inputSymbol = this.data.secCode;
    this.inputRepoMarket = this.data && this.data.repoPeriod ? this.data.repoPeriod : null;
  }

  navigateToDetails() {
    this.dialogRef.close();
    if (this.inputRepoMarket) {
      this.router.navigateByUrl('/repo-details/' + this.inputSymbol + '/' + this.inputRepoMarket + '/trading');
    } else {
      this.router.navigateByUrl('/details/' + this.inputSymbol + '/trading');
    }
  }
}
