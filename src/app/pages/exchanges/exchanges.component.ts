import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExchangesService } from './exchanges.service';

@Component({
  selector: 'app-exchanges',
  templateUrl: './exchanges.component.html',
  styleUrls: ['./exchanges.component.css']
})
export class ExchangesComponent implements OnInit, OnDestroy {

  interval;

  data = [] as any [];

  constructor(private exchangesService: ExchangesService) { }

  ngOnInit(): void {
    this.getExchanges();
    this.interval = setInterval(() => {
      this.getExchanges();
    }, 10000);
  }

  getExchanges() {
    this.exchangesService.getExchanges().subscribe((res: any) => {
      this.data = res;
    });
  }

  ngOnDestroy() {
    this.removeInterval();
  }

  removeInterval() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

}
