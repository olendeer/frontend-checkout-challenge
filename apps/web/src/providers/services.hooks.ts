'use client';

import { useContext } from 'react';

import { CartService } from 'domain/cart';
import { CatalogService } from 'domain/catalog';
import { CheckoutService } from 'domain/checkout';
import { OrderService } from 'domain/order';
import { PaymentService } from 'domain/payment';
import { SessionService } from 'domain/session';

import { AppServices } from './services';
import { ServicesContext } from './services.context';

export const useServices = (): AppServices => {
  const services = useContext(ServicesContext);

  if (!services) {
    throw new Error('AppProvider не найден: оберните дерево компонентов в <AppProvider>.');
  }

  return services;
};

export const useCartService = (): CartService => useServices().cart;
export const useCatalogService = (): CatalogService => useServices().catalog;
export const useCheckoutService = (): CheckoutService => useServices().checkout;
export const useOrderService = (): OrderService => useServices().order;
export const usePaymentService = (): PaymentService => useServices().payment;
export const useSessionService = (): SessionService => useServices().session;
