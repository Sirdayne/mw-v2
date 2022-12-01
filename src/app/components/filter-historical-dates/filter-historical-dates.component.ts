import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { merge, Subscription } from 'rxjs';

@Component({
  selector: 'app-filter-historical-dates',
  templateUrl: './filter-historical-dates.component.html',
  styleUrls: ['./filter-historical-dates.component.css']
})
export class FilterHistoricalDatesComponent implements OnInit, OnDestroy {
  @Input() currentStartDateControl;
  @Input() currentEndDateControl;
  @Input() lastStartDateControl;
  @Input() lastEndDateControl;
  @Input() now;

  subscription = new Subscription();

  dates = [] as any[];

  constructor() { }

  ngOnInit(): void {
    this.initJSDates();
    this.onDatesChanges();
  }

  initJSDates() {
    this.dates.push(
      {label: 'Weekly', active: false, dates: {
        currentStartDateControl: new Date(this.now.getTime() - 1000 * 60 * 60 * 24 * 6),
        currentEndDateControl: this.now,
        lastStartDateControl: new Date(this.now.getTime() - 1000 * 60 * 60 * 24 * 13),
        lastEndDateControl: new Date(this.now.getTime() - 1000 * 60 * 60 * 24 * 7)
      }
    });

    this.dates.push(
      {label: 'Monthly', active: false, dates: {
          currentStartDateControl: new Date(new Date(this.now.getTime()).setMonth(this.now.getMonth() - 1)),
          currentEndDateControl: this.now,
          lastStartDateControl: new Date(new Date(this.now.getTime()).setMonth(this.now.getMonth() - 2)),
          lastEndDateControl: new Date(new Date(this.now.getTime()).setMonth(this.now.getMonth() - 1) - 1000 * 60 * 60 * 24)
        }
      });

    this.dates.push(
      {label: 'Yearly', active: false, dates: {
          currentStartDateControl: new Date(new Date(this.now.getTime()).setFullYear(this.now.getFullYear() - 1)),
          currentEndDateControl: this.now,
          lastStartDateControl: new Date(new Date(this.now.getTime()).setFullYear(this.now.getFullYear() - 2)),
          lastEndDateControl: new Date(new Date(this.now.getTime()).setFullYear(this.now.getFullYear() - 1) - 1000 * 60 * 60 * 24)
        }
      });
  }

  onDatesChanges() {
    this.subscription.add(merge(
      this.currentStartDateControl.valueChanges,
      this.currentEndDateControl.valueChanges,
      this.lastStartDateControl.valueChanges,
      this.lastEndDateControl.valueChanges
    ).subscribe(res => {
      this.dates.forEach(date => date.active = false);
    }));
  }

  setDates(item) {
    const { dates } = item;
    this.currentStartDateControl.patchValue(dates.currentStartDateControl);
    this.currentEndDateControl.patchValue(dates.currentEndDateControl);
    this.lastStartDateControl.patchValue(dates.lastStartDateControl);
    this.lastEndDateControl.patchValue(dates.lastEndDateControl);
    item.active = true;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
