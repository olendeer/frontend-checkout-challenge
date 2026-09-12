import { Delivery } from 'domain/contracts';

import { DeliveryFormValues } from './checkout.types';

// Значения формы → тело, которое понимает API: самовывоз и курьер различаются набором полей.
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
