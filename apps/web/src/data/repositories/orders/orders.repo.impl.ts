import type { Order as OrderResponse, Payment as PaymentResponse } from '@checkout/contracts';

import { HttpClient, RequestConfig } from 'core/http';
import { OrderDto } from 'data/dto/order';
import { PaymentDto } from 'data/dto/payment';
import { API } from 'data/endpoints';
import { CreateOrder } from 'domain/contracts';
import { Order } from 'domain/order/entities';
import { Payment } from 'domain/payment/entities';

import { OrdersRepo } from './orders.repo';

export class OrdersRepoImpl implements OrdersRepo {
  constructor(private readonly _http: HttpClient) {}

  createOrder = async (payload: CreateOrder, config: RequestConfig): Promise<Order> => {
    const response = await this._http.post<OrderResponse, CreateOrder>(
      API.orders.toUrl(),
      payload,
      config,
    );

    return OrderDto.mapToEntity(response.data);
  };

  getOrder = async (orderId: string, config?: RequestConfig): Promise<Order> => {
    const response = await this._http.get<OrderResponse>(
      API.orders.byId.toUrl({ orderId }),
      config,
    );

    return OrderDto.mapToEntity(response.data);
  };

  getOrders = async (config?: RequestConfig): Promise<Order[]> => {
    const response = await this._http.get<OrderResponse[]>(API.orders.toUrl(), config);

    return OrderDto.mapToEntityList(response.data);
  };

  getOrderPayments = async (orderId: string, config?: RequestConfig): Promise<Payment[]> => {
    const response = await this._http.get<PaymentResponse[]>(
      API.orders.payments.toUrl({ orderId }),
      config,
    );

    return PaymentDto.mapToEntityList(response.data);
  };
}
