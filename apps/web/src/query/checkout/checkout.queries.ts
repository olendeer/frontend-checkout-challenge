'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { CheckoutOptions, Delivery, Quote } from 'domain/contracts';
import { useCheckoutService } from 'providers/services.hooks';

import { queryKeys } from '../query-keys';

const QUOTE_REFRESH_MS = 5 * 60 * 1000;

export const useCheckoutOptionsQuery = (): UseQueryResult<CheckoutOptions> => {
  const checkout = useCheckoutService();

  return useQuery({
    queryFn: ({ signal }) => checkout.getOptions({ signal }),
    queryKey: queryKeys.checkoutOptions(),
  });
};

export const useQuoteQuery = (
  delivery: Delivery | null,
  cartVersion?: number,
  isEnabled = true,
): UseQueryResult<Quote> => {
  const checkout = useCheckoutService();

  return useQuery({
    enabled: isEnabled && Boolean(delivery) && cartVersion !== undefined,
    queryFn: ({ signal }) => checkout.createQuote(delivery as Delivery, { signal }),
    queryKey: queryKeys.quote(cartVersion ?? 0, delivery),
    refetchInterval: QUOTE_REFRESH_MS,
    staleTime: QUOTE_REFRESH_MS,
  });
};
