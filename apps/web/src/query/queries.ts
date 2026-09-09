'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  Cart,
  CheckoutOptions,
  Delivery,
  Order,
  Payment,
  Product,
  Quote,
  Sandbox,
} from 'domain/contracts';
import { getIsPaymentPending } from 'domain/order';
import {
  useCartService,
  useCatalogService,
  useCheckoutService,
  useOrderService,
  usePaymentService,
  useSessionService,
} from 'providers/services.hooks';

import { queryKeys } from './query-keys';

const POLL_INTERVAL_MS = 1000;
const QUOTE_REFRESH_MS = 5 * 60 * 1000;

export const useSessionQuery = (): UseQueryResult<string | null> => {
  const session = useSessionService();

  return useQuery({
    queryFn: () => session.ensureToken(),
    queryKey: queryKeys.session(),
    staleTime: Infinity,
  });
};

export const useProductsQuery = (): UseQueryResult<Product[]> => {
  const catalog = useCatalogService();

  return useQuery({
    queryFn: ({ signal }) => catalog.getProducts({ signal }),
    queryKey: queryKeys.products(),
  });
};

export const useCartQuery = (): UseQueryResult<Cart> => {
  const cart = useCartService();

  return useQuery({
    queryFn: ({ signal }) => cart.getCart({ signal }),
    queryKey: queryKeys.cart(),
  });
};

export const useCheckoutOptionsQuery = (): UseQueryResult<CheckoutOptions> => {
  const checkout = useCheckoutService();

  return useQuery({
    queryFn: ({ signal }) => checkout.getOptions({ signal }),
    queryKey: queryKeys.checkoutOptions(),
  });
};

export const useSandboxQuery = (enabled = true): UseQueryResult<Sandbox> => {
  const payment = usePaymentService();

  return useQuery({
    enabled,
    queryFn: ({ signal }) => payment.getSandbox({ signal }),
    queryKey: queryKeys.sandbox(),
    staleTime: Infinity,
  });
};

export const useOrderQuery = (orderId: string): UseQueryResult<Order> => {
  const order = useOrderService();

  return useQuery({
    queryFn: ({ signal }) => order.getOrder(orderId, { signal }),
    queryKey: queryKeys.order(orderId),
    refetchInterval: (query) =>
      query.state.data && getIsPaymentPending(query.state.data) ? POLL_INTERVAL_MS : false,
    staleTime: 0,
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
