import { CheckoutOptions, Delivery, PickupPoint, Quote } from 'domain/contracts';

import { DeliveryFormValues } from './checkout.types';

export const toDelivery = (values: DeliveryFormValues): Delivery => {
  if (values.method === 'pickup') {
    return { method: 'pickup', pickupPointId: values.pickupPointId };
  }

  return {
    address: {
      city: values.address.city.trim(),
      house: values.address.house.trim(),
      street: values.address.street.trim(),
      ...(values.address.apartment.trim() ? { apartment: values.address.apartment.trim() } : {}),
    },
    method: 'courier',
  };
};

export const getIsQuoteExpired = (quote: Quote): boolean =>
  new Date(quote.expiresAt).getTime() <= Date.now();

export const getPickupPoints = (options?: CheckoutOptions): PickupPoint[] =>
  options?.deliveryMethods.find((method) => method.id === 'pickup')?.pickupPoints ?? [];

export const formatDelivery = (delivery: Delivery, points: PickupPoint[]): string => {
  if (delivery.method === 'pickup') {
    const point = points.find((item) => item.id === delivery.pickupPointId);

    return point ? `Самовывоз — ${point.title}, ${point.address}` : 'Самовывоз';
  }

  const apartment = delivery.address.apartment ? `, кв. ${delivery.address.apartment}` : '';

  return `Курьер — ${delivery.address.city}, ${delivery.address.street}, д. ${delivery.address.house}${apartment}`;
};
