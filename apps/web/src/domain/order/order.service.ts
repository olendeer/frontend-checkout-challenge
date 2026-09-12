import { RequestConfig } from 'core/http';
import { CreateOrder } from 'domain/contracts';
import { Payment } from 'domain/payment/entities';

import { Order } from './entities';

export interface OrderService {
  createOrder: (payload: CreateOrder, config?: RequestConfig) => Promise<Order>;
  getOrder: (orderId: string, config?: RequestConfig) => Promise<Order>;
  getOrderPayments: (orderId: string, config?: RequestConfig) => Promise<Payment[]>;
  getOrders: (config?: RequestConfig) => Promise<Order[]>;
}
