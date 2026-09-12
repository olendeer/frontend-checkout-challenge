import type { Cart as CartResponse } from '@checkout/contracts';

import { Cart } from 'domain/cart/entities';

export class CartDto {
  static mapToEntity(values: CartResponse): Cart {
    return new Cart(
      values.id,
      values.version,
      values.items,
      values.quantity,
      values.subtotal,
      values.currency,
    );
  }
}
