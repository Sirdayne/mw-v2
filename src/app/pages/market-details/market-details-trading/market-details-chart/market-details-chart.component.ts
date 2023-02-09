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
import { combineLatest, debounceTime, finalize, Subscription } from 'rxjs';
import { MarketHistory } from '../../../../core/models/market-history.interface';
import { MarketDetailsService } from '../../market-details.service';
import { FormControl } from '@angular/forms';
import { DateTime } from 'luxon';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ChartNav, ChartPoint } from '../../../../core/models/chart.interface';

@Component({
  selector: 'app-market-details-chart',
  templateUrl: './market-details-chart.component.html',
  styleUrls: ['./market-details-chart.component.css']
})
export class MarketDetailsChartComponent implements OnInit, OnDestroy {
  @Input() inputSymbol;
  @Input() isEtf;
  @Input() inputRepoMarket;
  @ViewChild('lineChart') lineChartRef: ElementRef;
  @ViewChild('navChart') navChartRef: ElementRef;
  @ViewChild('barChart') barChartRef: ElementRef;

  symbol;
  now = new Date();
  startDateControl = new FormControl(new Date(this.now.getTime() - 1000 * 60 * 60 * 24 * 7));
  endDateControl = new FormControl(this.now);
  loading = true;

  data;
  navs;
  lineChart;
  navChart;
  barChart;
  labels;
  navLabels;
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
      this.fetchMarketChart();
    }
  }

  setSymbol() {
    this.route?.parent?.params.subscribe( params => {
      this.symbol = params['symbol'];
      if (this.getSymbol) {
        this.fetchMarketChart();
      }
    })
  }

  onDateControlsChange() {
    this.subscription.add(this.endDateControl.valueChanges
      .pipe(debounceTime(250))
      .subscribe((endDate) => {
        if (endDate) {
          this.fetchMarketChart();
        }
      }));
  }

  fetchMarketChart() {
    this.loading = true;
    if (this.inputRepoMarket) {
      this.getRepoMarketChart();
    } else {
      this.getMarketChart();
    }
  }

  getRepoMarketChart() {
    this.marketDetailsService.getRepoMarketChart(this.getSymbol,
      this.inputRepoMarket,
      `${DateTime.fromJSDate(this.startDateControl.value).toISODate()}`,
      `${DateTime.fromJSDate(this.endDateControl.value).plus({ days: 1 }) .toISODate()}`)
      .pipe(finalize(() => this.loading = false))
      .subscribe((chartPoints: ChartPoint[]) => {
        this.data = chartPoints ? chartPoints : [] as ChartPoint[];
        this.setChartData();
      }, () => {
        this.data = [] as ChartPoint[];
        this.setChartData();
      });
  }

  getMarketChart() {
    this.marketDetailsService.getMarketChart(this.getSymbol,
      `${DateTime.fromJSDate(this.startDateControl.value).toISODate()}`,
      `${DateTime.fromJSDate(this.endDateControl.value).plus({ days: 1 }) .toISODate()}`)
      .pipe(finalize(() => this.loading = false))
      .subscribe((chartPoints: ChartPoint[]) => {
        this.data = chartPoints ? chartPoints : [] as ChartPoint[];
        this.setChartData();
      }, () => {
        this.data = [] as ChartPoint[];
        this.setChartData();
      });

    if (this.isEtf) {
      this.marketDetailsService.getNavChart(this.getSymbol,
        `${DateTime.fromJSDate(this.startDateControl.value).toISODate()}`,
        `${DateTime.fromJSDate(this.endDateControl.value).plus({ days: 1 }) .toISODate()}`)
        .subscribe((chartNavs: ChartNav[]) => {
          this.navs = chartNavs ? chartNavs : [] as ChartNav[];
          this.setNavData();
        }, () => {
          this.navs = [] as ChartNav[];
          this.setNavData();
        });
    }
  }

  setChartData() {
    this.setLabels();
    this.setLineChart();
    this.setBarChart();
  }

  setNavData() {
    this.setNavLabels();
    this.setNavChart();
  }

  setLabels() {
    this.labels = [];
    this.dataPoints = [];
    this.dataValues = [];
    this.data.forEach(item => {
      this.labels.push(new Date(item.x).toLocaleString());
      this.dataPoints.push(item.price);
      this.dataValues.push(item.value);
    })
  }

  setNavLabels() {
    this.navLabels = [];
    this.dataNavs = [];
    this.navs.forEach(item => {
      this.navLabels.push(new Date(item.dateAt).toLocaleString().split(',')[0]);
      this.dataNavs.push(item.nav);
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

  setNavChart() {
    if (this.navChart) {
      this.navChart.destroy();
    }
    const data = {
      labels: this.navLabels,
      datasets: [
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
            text: 'Nav Summary'
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
              text: 'Nav'
            }
          }
        }
      },
    };

    const ctx = this.navChartRef.nativeElement.getContext('2d');
    this.navChart = new Chart(ctx, config as ChartConfiguration);
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
