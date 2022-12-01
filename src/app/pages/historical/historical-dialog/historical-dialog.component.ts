import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

interface DataHistoricalDialog {
  secCode: string;
  date: string;
}

@Component({
  selector: 'app-historical-dialog',
  templateUrl: './historical-dialog.component.html',
  styleUrls: ['./historical-dialog.component.css']
})
export class HistoricalDialogComponent implements OnInit {
  inputSymbol: string;
  date: string;

  constructor(public dialogRef: MatDialogRef<HistoricalDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DataHistoricalDialog,
              private router: Router) {
  }

  ngOnInit(): void {
    this.inputSymbol = this.data?.secCode;
    this.date = this.data?.date;
  }
}
