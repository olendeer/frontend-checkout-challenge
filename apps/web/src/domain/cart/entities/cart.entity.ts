import { CartItem, Currency } from 'domain/contracts';

import { QuantityIndex } from '../cart.types';

export class Cart {
  constructor(
    public readonly id: string,
    public readonly version: number,
    public readonly items: CartItem[],
    public readonly quantity: number,
    public readonly subtotal: number,
    public readonly currency: Currency,
  ) {}

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  // Один проход: карточка каталога узнаёт своё количество за O(1).
  get quantityIndex(): QuantityIndex {
    return this.items.reduce(
      (index, item) => index.set(item.productId, item.quantity),
      new Map<string, number>(),
    );
  }
}
