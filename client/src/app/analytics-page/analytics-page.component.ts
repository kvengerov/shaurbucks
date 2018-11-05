import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {AnalyticsPage} from "../shared/interfaces";
import {Subscription} from "rxjs";
import {Chart} from 'chart.js'

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gain') gainRef: ElementRef;
  @ViewChild('order') orderRef: ElementRef;

  average: number;
  pending = true;
  aSub: Subscription;

  constructor(private analyticsService: AnalyticsService) {
  }

  ngAfterViewInit() {
    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(255, 99, 132)'
    };
    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(54, 162, 235)'
    };

    this.aSub = this.analyticsService.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average;

      gainConfig.labels = data.chart.map(item => item.label);
      gainConfig.data = data.chart.map(item => item.gain);

      /* temp data gain*/
      // gainConfig.labels.push('03.11.2018');
      // gainConfig.data.push(200);
      // gainConfig.labels.push('04.11.2018');
      // gainConfig.data.push(180);
      // gainConfig.labels.push('05.11.2018');
      // gainConfig.data.push(250);

      orderConfig.labels = data.chart.map(item => item.label);
      orderConfig.data = data.chart.map(item => item.order);

      /* temp data order*/
      // orderConfig.labels.push('03.11.2018');
      // orderConfig.data.push(6);
      // orderConfig.labels.push('04.11.2018');
      // orderConfig.data.push(5);
      // orderConfig.labels.push('05.11.2018');
      // orderConfig.data.push(8);

      const gainContext = this.gainRef.nativeElement.getContext('2d');
      const orderContext = this.orderRef.nativeElement.getContext('2d');
      gainContext.canvas.height = '300px';
      orderContext.canvas.height = '300px';

      new Chart(gainContext, createChartConfig(gainConfig));
      new Chart(orderContext, createChartConfig(orderConfig));

      this.pending = false

    })
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }
}

function createChartConfig({labels, data, label, color}) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label, data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}


