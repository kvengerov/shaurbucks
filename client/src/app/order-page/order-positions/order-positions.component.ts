import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {PositionService} from '../../shared/services/position.service';
import {Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {Position} from '../../shared/interfaces';
import {OrderService} from '../../services/order.service';
import {MaterialService} from '../../shared/services/material.service';

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.css']
})
export class OrderPositionsComponent implements OnInit {

  positions$: Observable<Position[]>;

  constructor(private route: ActivatedRoute,
              private positionsService: PositionService,
              private orderService: OrderService) {
  }

  ngOnInit() {
    this.positions$ = this.route.params.pipe(
      switchMap(
        (params: Params) => {
          return this.positionsService.getPosition(params['id'])
        }
      ),
      /* Добавляем дефолтное значение в поле position.quantity */
      map(
        (positions: Position[]) => {
          return positions.map(position => {
            position.quantity = 1;
            return position
          })
        }
      )
    )
  }

  addToOrder(position: Position) {
    console.log(position);
    MaterialService.toast(`Добавлено x ${position.quantity}`);
    this.orderService.add(position);
  }

}
