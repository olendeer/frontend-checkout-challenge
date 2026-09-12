'use client';

import { useMemo } from 'react';

import { QuantityIndex } from 'domain/cart';
import { Product } from 'domain/catalog';
import { useCartQuery, useProductsQuery, useSetCartItemMutation } from 'query';

const EMPTY_INDEX: QuantityIndex = new Map();

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

  const quantityIndex = useMemo(() => cart.data?.quantityIndex ?? EMPTY_INDEX, [cart.data]);

  const addToCart = (product: Product): void => {
    const nextQuantity = Math.min((quantityIndex.get(product.id) ?? 0) + 1, product.maxQuantity);

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
