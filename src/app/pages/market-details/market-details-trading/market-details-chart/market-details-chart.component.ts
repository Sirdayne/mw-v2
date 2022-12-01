import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Chart, ChartConfiguration, ChartItem, registerables } from 'chart.js';
import { debounceTime, finalize, Subscription } from 'rxjs';
import { MarketHistory } from '../../../../core/models/market-history.interface';
import { MarketDetailsService } from '../../market-details.service';
import { FormControl } from '@angular/forms';
import { DateTime } from 'luxon';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-market-details-chart',
  templateUrl: './market-details-chart.component.html',
  styleUrls: ['./market-details-chart.component.css']
})
export class MarketDetailsChartComponent implements OnInit, OnDestroy {
  @Input() inputSymbol;
  @ViewChild('lineChart') lineChartRef: ElementRef;
  @ViewChild('barChart') barChartRef: ElementRef;

  symbol;
  now = new Date();
  startDateControl = new FormControl(new Date(this.now.getTime() - 1000 * 60 * 60 * 24 * 7));
  endDateControl = new FormControl(this.now);
  loading = true;

  data;
  lineChart;
  barChart;
  labels;
  dataPoints;
  dataNavs;
  dataValues;

  subscription = new Subscription();

  constructor(private marketDetailsService: MarketDetailsService,
              private route: ActivatedRoute,
              public datePipe: DatePipe) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.setSymbol();
    this.onDateControlsChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.inputSymbol && changes.inputSymbol.currentValue) {
      this.getMarketChart();
    }
  }

  setSymbol() {
    this.route?.parent?.params.subscribe( params => {
      this.symbol = params['symbol'];
      if (this.getSymbol) {
        this.getMarketChart();
      }
    })
  }

  onDateControlsChange() {
    this.subscription.add(this.endDateControl.valueChanges
      .pipe(debounceTime(250))
      .subscribe((endDate) => {
        if (endDate) {
          this.getMarketChart();
        }
      }));
  }

  getMarketChart() {
    this.loading = true;
    this.marketDetailsService.getMarketChart(this.getSymbol,
      `${DateTime.fromJSDate(this.startDateControl.value).toISODate()}`,
      `${DateTime.fromJSDate(this.endDateControl.value).plus({ days: 1 }) .toISODate()}`)
      .pipe(finalize(() => this.loading = false))
      .subscribe((res: MarketHistory[]) => {
        this.data = res ? res : [] as MarketHistory[];
        this.setLabels();
        this.setLineChart();
        this.setBarChart();
      });
  }

  setLabels() {
    this.labels = [];
    this.dataPoints = [];
    this.dataNavs = [];
    this.dataValues = [];
    this.data.forEach(item => {
      this.labels.push(new Date(item.x).toLocaleString());
      this.dataPoints.push(item.price);
      this.dataNavs.push(item.nav);
      this.dataValues.push(item.value);
    })
  }

  setLineChart() {
    if (this.lineChart) {
      this.lineChart.destroy();
    }
    const data = {
      labels: this.labels,
      datasets: [
        {
          label: 'Price',
          data: this.dataPoints,
          backgroundColor: '#002659',
          borderColor: '#002659',
          fill: false,
          cubicInterpolationMode: 'monotone',
          tension: 0.4
        },
        {
          label: 'Nav',
          data: this.dataNavs,
          backgroundColor: '#4b6ab7',
          borderColor: '#4b6ab7',
          fill: false,
          cubicInterpolationMode: 'monotone',
          tension: 0.4
        }
      ]
    }

    const config = {
      type: 'line',
      data,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Market Trading Summary'
          },
        },
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Price'
            }
          }
        }
      },
    };

    const ctx = this.lineChartRef.nativeElement.getContext('2d');
    this.lineChart = new Chart(ctx, config as ChartConfiguration);
  }

  setBarChart() {
    if (this.barChart) {
      this.barChart.destroy();
    }
    const data = {
      labels: this.labels,
      datasets: [{
        label: 'Value',
        backgroundColor: '#b7924b',
        borderColor: '#b7924b',
        data: this.dataValues,
      }]
    };

    const config = {
      type: 'bar',
      data,
      options: {}
    };

    const ctx2 = this.barChartRef.nativeElement.getContext('2d');
    this.barChart = new Chart(ctx2, config as ChartConfiguration);
  }

  setPeriod(startDate) {
    this.startDateControl.patchValue(startDate);
    this.endDateControl.patchValue(this.now);
  }

  get getSymbol() {
    return this.inputSymbol ? this.inputSymbol : this.symbol;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
