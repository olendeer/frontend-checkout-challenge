import { Customer, DeliveryMethodId, PaymentMethod } from 'domain/contracts';

export interface AddressFormValues {
  apartment: string;
  city: string;
  house: string;
  street: string;
}

export interface DeliveryFormValues {
  address: AddressFormValues;
  method: DeliveryMethodId;
  pickupPointId: string;
}

export interface CheckoutFormValues {
  customer: Customer;
  delivery: DeliveryFormValues;
  paymentMethod: PaymentMethod;
}
