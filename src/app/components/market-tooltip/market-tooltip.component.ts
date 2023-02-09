import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-market-tooltip',
  templateUrl: './market-tooltip.component.html',
  styleUrls: ['./market-tooltip.component.css']
})
export class MarketTooltipComponent implements OnInit {
  @Input() text = 'Based on currency rates from National Bank Of Kazakhstan for the day of trade';
  constructor() { }
  ngOnInit(): void {
  }

}
