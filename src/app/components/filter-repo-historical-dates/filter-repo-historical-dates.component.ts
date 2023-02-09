import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { merge, Subscription } from 'rxjs';

@Component({
  selector: 'app-filter-repo-historical-dates',
  templateUrl: './filter-repo-historical-dates.component.html',
  styleUrls: ['./filter-repo-historical-dates.component.css']
})
export class FilterRepoHistoricalDatesComponent implements OnInit, OnDestroy {
  @Input() startDateControl;
  @Input() endDateControl;
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
        startDateControl: new Date(this.now.getTime() - 1000 * 60 * 60 * 24 * 6),
        endDateControl: this.now
      }
    });

    this.dates.push(
      {label: 'Monthly', active: false, dates: {
          startDateControl: new Date(new Date(this.now.getTime()).setMonth(this.now.getMonth() - 1)),
          endDateControl: this.now
        }
      });

    this.dates.push(
      {label: 'Yearly', active: false, dates: {
          startDateControl: new Date(new Date(this.now.getTime()).setFullYear(this.now.getFullYear() - 1)),
          endDateControl: this.now
        }
      });
  }

  onDatesChanges() {
    this.subscription.add(merge(
      this.startDateControl.valueChanges,
      this.endDateControl.valueChanges
    ).subscribe(res => {
      this.dates.forEach(date => date.active = false);
    }));
  }

  setDates(item) {
    const { dates } = item;
    this.startDateControl.patchValue(dates.startDateControl);
    this.endDateControl.patchValue(dates.endDateControl);
    item.active = true;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
