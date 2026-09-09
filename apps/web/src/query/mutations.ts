'use client';

import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';

import { CreateOrder, Order, Payment, Scenario } from 'domain/contracts';
import { useCartService, useOrderService, usePaymentService } from 'providers/services.hooks';

import { queryKeys } from './query-keys';

export interface SetCartItemVariables {
  productId: string;
  quantity: number;
}

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

export const useCreateOrderMutation = (): UseMutationResult<Order, Error, CreateOrder> => {
  const order = useOrderService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrder) => order.createOrder(payload),
    onSuccess: (createdOrder) => {
      queryClient.setQueryData(queryKeys.order(createdOrder.id), createdOrder);
      queryClient.invalidateQueries({ queryKey: queryKeys.cart() });
    },
  });
};

export const useStartPaymentMutation = (
  orderId: string,
): UseMutationResult<Payment, Error, Scenario> => {
  const payment = usePaymentService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scenario: Scenario) => payment.startPayment(orderId, scenario),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.order(orderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orderPayment(orderId) });
    },
  });
};
