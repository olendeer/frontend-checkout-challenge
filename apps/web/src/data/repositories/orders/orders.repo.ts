import { RequestConfig } from 'core/http';
import { CreateOrder, Order, Payment } from 'domain/contracts';

export interface OrdersRepo {
  createOrder: (payload: CreateOrder, config: RequestConfig) => Promise<Order>;
  getOrder: (orderId: string, config?: RequestConfig) => Promise<Order>;
  getOrderPayments: (orderId: string, config?: RequestConfig) => Promise<Payment[]>;
  getOrders: (config?: RequestConfig) => Promise<Order[]>;
}
