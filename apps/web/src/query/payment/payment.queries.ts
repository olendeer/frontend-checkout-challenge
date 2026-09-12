'use client';

import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';

import { Scenario } from 'domain/contracts';
import { Payment, Sandbox } from 'domain/payment';
import { usePaymentService } from 'providers/services.hooks';

import { queryKeys } from '../query-keys';

export const useSandboxQuery = (enabled = true): UseQueryResult<Sandbox> => {
  const payment = usePaymentService();

  return useQuery({
    enabled,
    queryFn: ({ signal }) => payment.getSandbox({ signal }),
    queryKey: queryKeys.sandbox(),
    staleTime: Infinity,
  });
};

export const useLatestPaymentQuery = (
  orderId: string,
  enabled: boolean,
): UseQueryResult<Payment | null> => {
  const payment = usePaymentService();

  return useQuery({
    enabled,
    queryFn: ({ signal }) => payment.getLatestPayment(orderId, { signal }),
    queryKey: queryKeys.orderPayment(orderId),
    staleTime: 0,
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
