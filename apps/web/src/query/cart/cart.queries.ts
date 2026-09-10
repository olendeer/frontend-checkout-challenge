'use client';

import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';

import { Cart } from 'domain/contracts';
import { useCartService } from 'providers/services.hooks';

import { queryKeys } from '../query-keys';

export interface SetCartItemVariables {
  productId: string;
  quantity: number;
}

export const useCartQuery = (): UseQueryResult<Cart> => {
  const cart = useCartService();

  return useQuery({
    queryFn: ({ signal }) => cart.getCart({ signal }),
    queryKey: queryKeys.cart(),
  });
};

export const useSetCartItemMutation = (): UseMutationResult<
  unknown,
  Error,
  SetCartItemVariables
> => {
  const cart = useCartService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: SetCartItemVariables) =>
      cart.setQuantity(productId, quantity),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart() }),
  });
};

export const useRemoveCartItemMutation = (): UseMutationResult<void, Error, string> => {
  const cart = useCartService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => cart.removeItem(productId),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart() }),
  });
};
