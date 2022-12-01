import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-rate-change',
  templateUrl: './rate-change.component.html',
  styleUrls: ['./rate-change.component.css']
})
export class RateChangeComponent implements OnInit {
  @Input() rate;

  constructor() { }

  ngOnInit(): void {
  }

  get getRate() {
    return this.rate ? Math.abs(this.rate) : 0;
  }

}
