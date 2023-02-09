import { Component, Input, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-two-row',
  templateUrl: './two-row.component.html',
  styleUrls: ['./two-row.component.css']
})
export class TwoRowComponent implements OnInit {
  @Input() label;
  @Input() data;
  @Input() isPrimary = false;
  @Input() isRate = false;

  constructor(private decimalPipe: DecimalPipe) { }

  ngOnInit(): void {
  }

  get getData() {
    const value = this.data;
    if (value && typeof value === 'number') {
      return this.decimalPipe.transform(value, '1.' );
    }
    return value;
  }

}
