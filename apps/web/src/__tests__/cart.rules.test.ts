import { describe, expect, it } from 'vitest';

import { getIsCartEmpty, getMaxQuantity, getQuantityIndex, getStockIndex } from 'domain/cart';
import { Cart, Product } from 'domain/contracts';

const product = (id: string, stock: number): Product => ({
  currency: 'RUB',
  description: '',
  id,
  price: 1000,
  sku: id,
  stock,
  title: id,
});

const cart = (items: Cart['items']): Cart => ({
  currency: 'RUB',
  id: 'cart',
  items,
  quantity: items.reduce((total, item) => total + item.quantity, 0),
  subtotal: items.reduce((total, item) => total + item.lineTotal, 0),
  version: 1,
});

describe('правила корзины', () => {
  it('строит индекс количеств одним проходом', () => {
    const index = getQuantityIndex(
      cart([
        { lineTotal: 2000, productId: 'lamp', quantity: 2, title: 'lamp', unitPrice: 1000 },
        { lineTotal: 1000, productId: 'mug', quantity: 1, title: 'mug', unitPrice: 1000 },
      ]),
    );

    expect(index.get('lamp')).toBe(2);
    expect(index.get('mug')).toBe(1);
    expect(index.get('bag')).toBeUndefined();
  });

  it('считает пустой корзину без позиций и без данных', () => {
    expect(getIsCartEmpty(cart([]))).toBe(true);
    expect(getIsCartEmpty(undefined)).toBe(true);
  });

  it('ограничивает количество остатком и лимитом контракта', () => {
    expect(getMaxQuantity(product('lamp', 10))).toBe(10);
    expect(getMaxQuantity(product('mug', 500))).toBe(99);
    expect(getMaxQuantity(product('clock', 0))).toBe(0);
  });

  it('строит индекс остатков по каталогу', () => {
    const index = getStockIndex([product('lamp', 10), product('clock', 0)]);

    expect(index.get('lamp')).toBe(10);
    expect(index.get('clock')).toBe(0);
  });
});
