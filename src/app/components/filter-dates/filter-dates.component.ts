import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter-dates',
  templateUrl: './filter-dates.component.html',
  styleUrls: ['./filter-dates.component.css']
})
export class FilterDatesComponent implements OnInit {
  @Input() startDateControl;
  @Input() endDateControl;
  @Input() now;
  @Output() setPeriod = new EventEmitter();

  dates = [] as any[];

  constructor() { }

  ngOnInit(): void {
    this.initJSDates();
  }

  initJSDates() {
    this.dates.push({label: 'Today', date: new Date(this.now.getTime()), ngClass: 'px-6'});
    this.dates.push({label: 'Two Days', date: new Date(new Date(this.now.getTime()).setDate(this.now.getDate() - 1)), ngClass: 'px-6'});
    this.dates.push({label: 'Week', date: new Date(this.now.getTime() - 1000 * 60 * 60 * 24 * 7)});
    this.dates.push({label: 'Month', date: new Date(new Date(this.now.getTime()).setMonth(this.now.getMonth() - 1))});
    this.dates.push({label: '3 Months', date: new Date(new Date(this.now.getTime()).setMonth(this.now.getMonth() - 3))});
    this.dates.push({label: 'Year', date: new Date(new Date(this.now.getTime()).setFullYear(this.now.getFullYear() - 1))});
  }

  emitSetPeriod(startDate) {
    this.setPeriod.emit(startDate);
  }

  areActiveDates(item) {
    return this.toDateString(item.date) === this.toDateString(this.startDateControl.value) && this.now &&
      this.toDateString(this.now) === this.toDateString(this.endDateControl.value);
  }

  toDateString(date) {
    return date && date.toDateString();
  }
}
