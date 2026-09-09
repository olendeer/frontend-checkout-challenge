import { Cart, Product } from 'domain/contracts';

const MAX_ITEM_QUANTITY = 99;

export type QuantityIndex = ReadonlyMap<string, number>;

export const getQuantityIndex = (cart?: Cart): QuantityIndex =>
  (cart?.items ?? []).reduce(
    (index, item) => index.set(item.productId, item.quantity),
    new Map<string, number>(),
  );

export const getIsProductAvailable = (product: Product): boolean => product.stock > 0;

export const getMaxQuantity = (product: Product): number =>
  Math.min(product.stock, MAX_ITEM_QUANTITY);

export const getIsCartEmpty = (cart?: Cart): boolean => !cart || cart.items.length === 0;

export const getStockIndex = (products?: Product[]): QuantityIndex =>
  (products ?? []).reduce(
    (index, product) => index.set(product.id, getMaxQuantity(product)),
    new Map<string, number>(),
  );
