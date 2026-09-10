import { ObjectSchema, object, string } from 'yup';

import { AddressFormValues, CheckoutFormValues, DeliveryFormValues } from 'domain/checkout';
import { DeliveryMethodId, PaymentMethod } from 'domain/contracts';

const PHONE_PATTERN = /^\+[1-9]\d{9,14}$/;

const EMAIL_MESSAGE = 'Укажите электронную почту в формате name@example.com';
const NAME_MESSAGE = 'Укажите имя, минимум 2 символа';
const PHONE_MESSAGE = 'Телефон в формате +79990000000';

// Ограничения длины повторяют серверные, поэтому лишний запрос не уходит.
const text = (max: number) => string().trim().max(max, `Не длиннее ${max} символов`).defined();

// Адрес заполняется только при курьерской доставке: базовая схема проверяет длину,
// обязательность добавляется ниже через when().
const addressSchema: ObjectSchema<AddressFormValues> = object({
  apartment: text(20),
  city: text(100),
  house: text(20),
  street: text(150),
});

const courierAddressSchema: ObjectSchema<AddressFormValues> = addressSchema.shape({
  city: text(100).min(2, 'Укажите город'),
  house: text(20).required('Укажите дом'),
  street: text(150).min(2, 'Укажите улицу'),
});

export const deliveryFormSchema: ObjectSchema<DeliveryFormValues> = object({
  address: addressSchema.when('method', {
    is: 'courier',
    then: () => courierAddressSchema,
  }),
  method: string<DeliveryMethodId>().oneOf(['courier', 'pickup']).defined(),
  pickupPointId: string()
    .defined()
    .when('method', {
      is: 'pickup',
      then: (schema) => schema.required('Выберите пункт выдачи'),
    }),
});

export const checkoutSchema: ObjectSchema<CheckoutFormValues> = object({
  customer: object({
    email: text(150).email(EMAIL_MESSAGE).required(EMAIL_MESSAGE),
    name: text(100).min(2, NAME_MESSAGE).required(NAME_MESSAGE),
    phone: text(20).matches(PHONE_PATTERN, PHONE_MESSAGE).required(PHONE_MESSAGE),
  }),
  delivery: deliveryFormSchema,
  paymentMethod: string<PaymentMethod>().oneOf(['card', 'cash_on_delivery']).defined(),
});

export const DEFAULT_CHECKOUT_VALUES: CheckoutFormValues = {
  customer: { email: '', name: '', phone: '' },
  delivery: {
    address: { apartment: '', city: '', house: '', street: '' },
    method: 'pickup',
    pickupPointId: '',
  },
  paymentMethod: 'card',
};
