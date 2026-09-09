'use client';

import { useMemo } from 'react';

import { getMaxQuantity, getQuantityIndex, QuantityIndex } from 'domain/cart';
import { Product } from 'domain/contracts';
import { useCartQuery, useProductsQuery, useSetCartItemMutation } from 'query';

interface CatalogModuleState {
  addToCart: (product: Product) => void;
  addToCartError: unknown;
  pendingProductId: string | null;
  products: ReturnType<typeof useProductsQuery>;
  quantityIndex: QuantityIndex;
}

export const useCatalogModule = (): CatalogModuleState => {
  const products = useProductsQuery();
  const cart = useCartQuery();
  const setCartItem = useSetCartItemMutation();

  const quantityIndex = useMemo(() => getQuantityIndex(cart.data), [cart.data]);

  const addToCart = (product: Product): void => {
    const nextQuantity = Math.min(
      (quantityIndex.get(product.id) ?? 0) + 1,
      getMaxQuantity(product),
    );

    setCartItem.mutate({ productId: product.id, quantity: nextQuantity });
  };

  return {
    addToCart,
    addToCartError: setCartItem.error,
    pendingProductId: setCartItem.isPending ? (setCartItem.variables?.productId ?? null) : null,
    products,
    quantityIndex,
  };
};
