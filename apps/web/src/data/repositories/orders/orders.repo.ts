import { RequestConfig } from 'core/http';
import { CreateOrder } from 'domain/contracts';
import { Order } from 'domain/order/entities';
import { Payment } from 'domain/payment/entities';

export interface OrdersRepo {
  createOrder: (payload: CreateOrder, config: RequestConfig) => Promise<Order>;
  getOrder: (orderId: string, config?: RequestConfig) => Promise<Order>;
  getOrderPayments: (orderId: string, config?: RequestConfig) => Promise<Payment[]>;
  getOrders: (config?: RequestConfig) => Promise<Order[]>;
}
