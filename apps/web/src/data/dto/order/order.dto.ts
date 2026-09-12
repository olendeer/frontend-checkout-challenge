import type { Order as OrderResponse } from '@checkout/contracts';

import { Order } from 'domain/order/entities';

export class OrderDto {
  static mapToEntity(values: OrderResponse): Order {
    return new Order(
      values.id,
      values.number,
      values.status,
      values.paymentStatus,
      values.paymentMethod,
      values.customer,
      values.items,
      values.delivery,
      values.subtotal,
      values.shipping,
      values.total,
      values.currency,
      values.createdAt,
    );
  }

  static mapToEntityList(values: OrderResponse[]): Order[] {
    return values.map(OrderDto.mapToEntity);
  }
}
