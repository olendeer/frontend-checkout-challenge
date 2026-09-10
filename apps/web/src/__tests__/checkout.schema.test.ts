import { describe, expect, it } from 'vitest';
import { ValidationError } from 'yup';

import { CheckoutFormValues } from 'domain/checkout';
import { checkoutSchema, DEFAULT_CHECKOUT_VALUES } from 'features/checkout/checkout.schema';

const CUSTOMER: CheckoutFormValues['customer'] = {
  email: 'buyer@example.test',
  name: 'Тестовый Покупатель',
  phone: '+79990000000',
};

const toValues = (delivery: Partial<CheckoutFormValues['delivery']>): CheckoutFormValues => ({
  ...DEFAULT_CHECKOUT_VALUES,
  customer: CUSTOMER,
  delivery: { ...DEFAULT_CHECKOUT_VALUES.delivery, ...delivery },
});

const getErrorPaths = async (values: CheckoutFormValues): Promise<string[]> => {
  try {
    await checkoutSchema.validate(values, { abortEarly: false });

    return [];
  } catch (error) {
    return error instanceof ValidationError ? error.inner.map(({ path }) => path ?? '').sort() : [];
  }
};

describe('checkoutSchema', () => {
  it('требует пункт выдачи при самовывозе и не требует адрес', async () => {
    expect(await getErrorPaths(toValues({ method: 'pickup' }))).toEqual(['delivery.pickupPointId']);
    expect(
      await getErrorPaths(toValues({ method: 'pickup', pickupPointId: 'point-center' })),
    ).toEqual([]);
  });

  it('требует адрес при курьерской доставке и не требует пункт выдачи', async () => {
    expect(await getErrorPaths(toValues({ method: 'courier' }))).toEqual([
      'delivery.address.city',
      'delivery.address.house',
      'delivery.address.street',
    ]);
  });

  it('принимает заполненный курьерский адрес без квартиры', async () => {
    const values = toValues({
      address: { apartment: '', city: 'Москва', house: '1', street: 'Тверская' },
      method: 'courier',
    });

    expect(await getErrorPaths(values)).toEqual([]);
  });

  it('проверяет контакты по серверным правилам', async () => {
    const values: CheckoutFormValues = {
      ...toValues({ method: 'pickup', pickupPointId: 'point-center' }),
      customer: { email: 'buyer', name: 'И', phone: '89990000000' },
    };

    expect(await getErrorPaths(values)).toEqual([
      'customer.email',
      'customer.name',
      'customer.phone',
    ]);
  });
});
