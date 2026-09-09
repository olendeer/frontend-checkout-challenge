import { RequestConfig } from 'core/http';
import { IdempotencyJournal } from 'core/idempotency';
import { OrdersRepo } from 'data/repositories';
import { CreateOrder, Order, Payment } from 'domain/contracts';

import { OrderService } from './order.service';

const CREATE_ORDER_INTENT = 'order:create';

export class OrderServiceImpl implements OrderService {
  constructor(
    private readonly _repo: OrdersRepo,
    private readonly _journal: IdempotencyJournal,
  ) {}

  createOrder = async (payload: CreateOrder, config?: RequestConfig): Promise<Order> => {
    const order = await this._repo.createOrder(payload, {
      ...config,
      idempotencyKey: this._journal.keyFor(CREATE_ORDER_INTENT, payload),
    });

    this._journal.release(CREATE_ORDER_INTENT);

    return order;
  };

  getOrder = (orderId: string, config?: RequestConfig): Promise<Order> =>
    this._repo.getOrder(orderId, config);

  getOrders = (config?: RequestConfig): Promise<Order[]> => this._repo.getOrders(config);

  getOrderPayments = (orderId: string, config?: RequestConfig): Promise<Payment[]> =>
    this._repo.getOrderPayments(orderId, config);
}
