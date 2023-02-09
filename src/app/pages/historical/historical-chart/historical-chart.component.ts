import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { HistoricalService } from '../historical.service';
import { DateTime } from 'luxon';
import { Chart, ChartConfiguration, ChartItem, registerables } from 'chart.js';

@Component({
  selector: 'app-historical-chart',
  templateUrl: './historical-chart.component.html',
  styleUrls: ['./historical-chart.component.css']
})
export class HistoricalChartComponent implements OnInit, OnChanges{
  @Input() inputSymbol;
  @Input() date;
  @ViewChild('barChart') barChartRef: ElementRef;

  symbol;
  data;
  barChart;
  loading;

  labels;
  dataPoints;
  dataValues;

  constructor(private historicalService: HistoricalService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.inputSymbol && changes.inputSymbol.currentValue) {
      this.getHistoricalChart();
    }
  }

  getHistoricalChart() {
    this.loading = true;
    this.historicalService.getHistoricalChart(this.inputSymbol,
      `${DateTime.fromJSDate(this.date).toISODate()}`,
    )
      .pipe(finalize(() => this.loading = false))
      .subscribe((res: any) => {
        this.data = res ? res : [];
        this.setLabels();
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

  get isData() {
    return this.data && this.data.length > 0;
  }
}
