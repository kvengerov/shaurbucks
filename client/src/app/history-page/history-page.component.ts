import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialService} from "../shared/services/material.service";
import {OrdersService} from "../shared/services/orders.service";
import {Subscription} from "rxjs";
import {Filter, Order} from "../shared/interfaces";

const STEP = 2;

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tooltip') tooltipRef: ElementRef;
  tooltip: MaterialInstance;
  isFilterVisible = false;

  oSub: Subscription;
  orders: Order[] = [];
  filter: Filter = {};

  offset = 0;
  limit = STEP;

  loading = false;
  reloading = false;
  noMoreOrders = false;

  constructor(private ordersService: OrdersService) {
  }

  ngOnInit() {
    this.reloading = true;
    this.getOrder();
  }

  ngOnDestroy() {
    this.tooltip.destroy();
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  private getOrder() {
    // const params = {
    //   offset: this.offset,
    //   limit: this.limit
    // };
    //
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    });

    this.oSub = this.ordersService.getOrder(params).subscribe(orders => {
      this.orders = this.orders.concat(orders);
      this.noMoreOrders = orders.length < STEP;
      this.loading = false;
      this.reloading = false;
    })
  }

  loadMore() {
    this.offset += STEP;
    this.loading = true;
    this.getOrder();
  }

  applyFilter(filter: Filter) {
    this.filter = filter;
    this.orders = [];
    this.offset = 0;
    this.reloading = true;
    this.getOrder();
  }

  isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0;
  }
}