'use client';

import { useMemo } from 'react';

import { QuantityIndex } from 'domain/cart';
import { Product } from 'domain/catalog';
import {
  useCartQuery,
  useProductsQuery,
  useRemoveCartItemMutation,
  useSetCartItemMutation,
} from 'query';

interface CartModuleState {
  cart: ReturnType<typeof useCartQuery>;
  changeError: unknown;
  pendingProductId: string | null;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  stockIndex: QuantityIndex;
}

export const useCartModule = (): CartModuleState => {
  const cart = useCartQuery();
  const products = useProductsQuery();
  const setCartItem = useSetCartItemMutation();
  const removeCartItem = useRemoveCartItemMutation();

  const stockIndex = useMemo(() => Product.toStockIndex(products.data), [products.data]);

  const getPendingProductId = (): string | null => {
    if (setCartItem.isPending) {
      return setCartItem.variables?.productId ?? null;
    }

    if (removeCartItem.isPending) {
      return removeCartItem.variables ?? null;
    }

    return null;
  };

  return {
    cart,
    changeError: setCartItem.error ?? removeCartItem.error,
    pendingProductId: getPendingProductId(),
    removeItem: (productId: string) => removeCartItem.mutate(productId),
    setQuantity: (productId: string, quantity: number) =>
      setCartItem.mutate({ productId, quantity }),
    stockIndex,
  };
};
