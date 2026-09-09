import { z } from 'zod';

import { CheckoutFormValues } from 'domain/checkout';

export const deliveryFormSchema = z
  .object({
    address: z.object({
      apartment: z.string().trim().max(20, 'Не длиннее 20 символов'),
      city: z.string().trim().max(100, 'Не длиннее 100 символов'),
      house: z.string().trim().max(20, 'Не длиннее 20 символов'),
      street: z.string().trim().max(150, 'Не длиннее 150 символов'),
    }),
    method: z.enum(['pickup', 'courier']),
    pickupPointId: z.string(),
  })
  .superRefine((values, ctx) => {
    if (values.method === 'pickup') {
      if (!values.pickupPointId) {
        ctx.addIssue({ code: 'custom', message: 'Выберите пункт выдачи', path: ['pickupPointId'] });
      }

      return;
    }

    if (values.address.city.length < 2) {
      ctx.addIssue({ code: 'custom', message: 'Укажите город', path: ['address', 'city'] });
    }

    if (values.address.street.length < 2) {
      ctx.addIssue({ code: 'custom', message: 'Укажите улицу', path: ['address', 'street'] });
    }

    if (!values.address.house) {
      ctx.addIssue({ code: 'custom', message: 'Укажите дом', path: ['address', 'house'] });
    }
  });

export const checkoutSchema = z.object({
  customer: z.object({
    email: z.email('Укажите электронную почту в формате name@example.com').max(150),
    name: z
      .string()
      .trim()
      .min(2, 'Укажите имя, минимум 2 символа')
      .max(100, 'Не длиннее 100 символов'),
    phone: z
      .string()
      .trim()
      .regex(/^\+[1-9]\d{9,14}$/, 'Телефон в формате +79990000000'),
  }),
  delivery: deliveryFormSchema,
  paymentMethod: z.enum(['card', 'cash_on_delivery']),
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
