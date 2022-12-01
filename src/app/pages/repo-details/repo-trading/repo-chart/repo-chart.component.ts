import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, finalize, Subscription } from 'rxjs';
import { MarketDetailsService } from '../../../market-details/market-details.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { MarketHistory } from '../../../../core/models/market-history.interface';
import { RepoDetailsService } from '../../repo-details.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-repo-chart',
  templateUrl: './repo-chart.component.html',
  styleUrls: ['./repo-chart.component.css']
})
export class RepoChartComponent implements OnInit {
  @ViewChild('lineChart') lineChartRef: ElementRef;
  @ViewChild('barChart') barChartRef: ElementRef;

  symbol;
  period;
  now = new Date();
  startDateControl = new FormControl(new Date(this.now.getTime() - 1000 * 60 * 60 * 24 * 7));
  endDateControl = new FormControl(this.now);
  loading = true;

  data;
  lineChart;
  barChart;
  labels;
  dataPoints;
  dataValues;

  subscription = new Subscription();

  constructor(private repoDetailsService: RepoDetailsService,
              private route: ActivatedRoute,
              public datePipe: DatePipe) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.setSymbol();
    this.onDateControlsChange();
  }

  setSymbol() {
    this.route?.parent?.params.subscribe( params => {
      this.symbol = params['symbol'];
      this.period = params['period'];
      if (this.symbol && this.period) {
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
    this.repoDetailsService.getRepoChart(this.symbol, this.period,
      DateTime.fromJSDate(this.startDateControl.value).toISODate(),
      DateTime.fromJSDate(this.endDateControl.value).toISODate())
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
    this.dataValues = [];
    this.data.forEach(item => {
      this.labels.push(new Date(item.x).toLocaleString());
      this.dataPoints.push(item.price);
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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
