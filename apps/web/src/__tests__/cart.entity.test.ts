import type { Cart as CartResponse, Product as ProductResponse } from '@checkout/contracts';
import { describe, expect, it } from 'vitest';

import { CartDto } from 'data/dto/cart';
import { ProductDto } from 'data/dto/catalog';
import { Product } from 'domain/catalog';

const product = (id: string, stock: number): ProductResponse => ({
  currency: 'RUB',
  description: '',
  id,
  price: 1000,
  sku: id,
  stock,
  title: id,
});

const cart = (items: CartResponse['items']): CartResponse => ({
  currency: 'RUB',
  id: 'cart',
  items,
  quantity: items.reduce((total, item) => total + item.quantity, 0),
  subtotal: items.reduce((total, item) => total + item.lineTotal, 0),
  version: 1,
});

describe('корзина и каталог', () => {
  it('строит индекс количеств одним проходом', () => {
    const index = CartDto.mapToEntity(
      cart([
        { lineTotal: 2000, productId: 'lamp', quantity: 2, title: 'lamp', unitPrice: 1000 },
        { lineTotal: 1000, productId: 'mug', quantity: 1, title: 'mug', unitPrice: 1000 },
      ]),
    ).quantityIndex;

    expect(index.get('lamp')).toBe(2);
    expect(index.get('mug')).toBe(1);
    expect(index.get('bag')).toBeUndefined();
  });

  it('считает пустой корзину без позиций', () => {
    expect(CartDto.mapToEntity(cart([])).isEmpty).toBe(true);
  });

  it('ограничивает количество остатком и лимитом контракта', () => {
    expect(ProductDto.mapToEntity(product('lamp', 10)).maxQuantity).toBe(10);
    expect(ProductDto.mapToEntity(product('mug', 500)).maxQuantity).toBe(99);
    expect(ProductDto.mapToEntity(product('clock', 0)).maxQuantity).toBe(0);
  });

  it('не даёт добавить товар без остатка', () => {
    expect(ProductDto.mapToEntity(product('lamp', 10)).isAvailable).toBe(true);
    expect(ProductDto.mapToEntity(product('clock', 0)).isAvailable).toBe(false);
  });

  it('строит индекс остатков по каталогу', () => {
    const products = ProductDto.mapToEntityList([product('lamp', 10), product('clock', 0)]);
    const index = Product.toStockIndex(products);

    expect(index.get('lamp')).toBe(10);
    expect(index.get('clock')).toBe(0);
    expect(Product.toStockIndex().size).toBe(0);
  });
});
