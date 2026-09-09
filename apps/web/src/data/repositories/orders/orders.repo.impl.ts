import { HttpClient, RequestConfig } from 'core/http';
import { API } from 'data/endpoints';
import { CreateOrder, Order, Payment } from 'domain/contracts';

import { OrdersRepo } from './orders.repo';

export class OrdersRepoImpl implements OrdersRepo {
  constructor(private readonly _http: HttpClient) {}

  createOrder = async (payload: CreateOrder, config: RequestConfig): Promise<Order> => {
    const response = await this._http.post<Order, CreateOrder>(API.orders.toUrl(), payload, config);

    return response.data;
  };

  getOrder = async (orderId: string, config?: RequestConfig): Promise<Order> => {
    const response = await this._http.get<Order>(API.orders.byId.toUrl({ orderId }), config);

    return response.data;
  };

  getOrders = async (config?: RequestConfig): Promise<Order[]> => {
    const response = await this._http.get<Order[]>(API.orders.toUrl(), config);

    return response.data;
  };

  getOrderPayments = async (orderId: string, config?: RequestConfig): Promise<Payment[]> => {
    const response = await this._http.get<Payment[]>(
      API.orders.payments.toUrl({ orderId }),
      config,
    );

    return response.data;
  };
}
