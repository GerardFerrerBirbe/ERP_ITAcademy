import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client/client';
import { ClientService } from 'src/app/models/client/client.service';
import { OrderLine } from 'src/app/models/order-line/order-line';
import { OrderLineService } from 'src/app/models/order-line/order-line.service';
import { StatisticsService } from './statistics.service';
import { StatsByClient } from './statsByClient';
import { StatsByProduct } from './statsByProduct';


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  totalSales: number;
  totalClients: number;

  products: StatsByProduct[];
  clients: StatsByClient[];
  
  constructor(
    private clientService: ClientService,
    private orderLineService: OrderLineService,
    private statisticsService: StatisticsService
  ) { }

  ngOnInit(): void {
    this.clientService.getClients()
      .subscribe(clients =>
        this.calculateTotalClients(clients));
    
    this.orderLineService.getOrderLines()
      .subscribe(orderLines =>
        this.calculateTotalSales(orderLines));

    this.statisticsService.getTopProducts()
      .subscribe(products => this.products = products)
    
    this.statisticsService.getTopClients()
      .subscribe(clients => this.clients = clients)
    
    }

  calculateTotalClients(clients: Client[]): void {
    this.totalClients = clients.length;        
  }
  
  calculateTotalSales(orderLines: OrderLine[]): void {
    this.totalSales = 0;

    orderLines.forEach(orderLine => {
      this.totalSales += orderLine.unitPrice * orderLine.quantity * (1 + orderLine.vat);
    });   
  }

}
