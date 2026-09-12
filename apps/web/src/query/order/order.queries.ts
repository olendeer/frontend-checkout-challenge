'use client';

import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';

import { CreateOrder } from 'domain/contracts';
import { Order } from 'domain/order';
import { useOrderService } from 'providers/services.hooks';

import { queryKeys } from '../query-keys';

const POLL_INTERVAL_MS = 1000;

export const useOrderQuery = (orderId: string): UseQueryResult<Order> => {
  const order = useOrderService();

  return useQuery({
    queryFn: ({ signal }) => order.getOrder(orderId, { signal }),
    queryKey: queryKeys.order(orderId),
    refetchInterval: (query) => (query.state.data?.isPaymentPending ? POLL_INTERVAL_MS : false),
    staleTime: 0,
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
