'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { PickupPoint } from 'domain/contracts';
import { usePaymentService } from 'providers/services.hooks';
import { queryKeys, useCheckoutOptionsQuery, useLatestPaymentQuery, useOrderQuery } from 'query';

export const useOrderModule = (orderId: string) => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const paymentService = usePaymentService();
  const order = useOrderQuery(orderId);
  const options = useCheckoutOptionsQuery();

  const isCardOrder = order.data?.paymentMethod === 'card';
  const payment = useLatestPaymentQuery(orderId, Boolean(order.data) && isCardOrder);

  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(searchParams.get('pay') === '1');

  const orderPaymentStatus = order.data?.paymentStatus;
  const attemptStatus = payment.data?.status;

  useEffect(() => {
    if (!orderPaymentStatus) {
      return;
    }

    queryClient.invalidateQueries({ queryKey: queryKeys.orderPayment(orderId) });
  }, [orderId, orderPaymentStatus, queryClient]);

  useEffect(() => {
    if (payment.data?.isTerminal) {
      paymentService.releaseAttempt(orderId);
    }
  }, [attemptStatus, orderId, payment.data, paymentService]);

  const pickupPoints = useMemo<PickupPoint[]>(
    () => options.data?.pickupPoints ?? [],
    [options.data],
  );

  return {
    closePaymentForm: () => setIsPaymentFormOpen(false),
    isPaymentFormOpen,
    openPaymentForm: () => setIsPaymentFormOpen(true),
    order,
    payment,
    pickupPoints,
  };
};
