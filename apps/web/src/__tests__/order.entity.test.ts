import type { Order as OrderResponse } from '@checkout/contracts';
import { describe, expect, it } from 'vitest';

import { OrderDto } from 'data/dto/order';
import { Order } from 'domain/order';

const order = (values: Partial<OrderResponse>): Order =>
  OrderDto.mapToEntity({
    createdAt: '2026-09-09T00:00:00.000Z',
    currency: 'RUB',
    customer: { email: 'buyer@example.test', name: 'Тест', phone: '+79990000000' },
    delivery: { method: 'pickup', pickupPointId: 'point-center' },
    id: 'o1',
    items: [],
    number: 'DEMO-1',
    paymentMethod: 'card',
    paymentStatus: 'unpaid',
    shipping: 0,
    status: 'awaiting_payment',
    subtotal: 1000,
    total: 1000,
    ...values,
  });

describe('заказ', () => {
  it('считает заказ оплаченным только по статусу с сервера', () => {
    expect(order({ paymentStatus: 'succeeded', status: 'paid' }).isPaid).toBe(true);
    expect(order({ paymentStatus: 'succeeded', status: 'awaiting_payment' }).isPaid).toBe(false);
    expect(order({ paymentStatus: 'pending', status: 'paid' }).isPaid).toBe(false);
  });

  it('завершает наличный заказ без онлайн-оплаты', () => {
    const cash = order({ paymentMethod: 'cash_on_delivery', status: 'confirmed' });

    expect(cash.isConfirmedOnDelivery).toBe(true);
    expect(cash.isComplete).toBe(true);
    expect(cash.canPay).toBe(false);
  });

  it('разрешает повтор оплаты после отказа и отмены, но не во время обработки', () => {
    expect(order({ paymentStatus: 'failed' }).canPay).toBe(true);
    expect(order({ paymentStatus: 'cancelled' }).canPay).toBe(true);
    expect(order({ paymentStatus: 'pending' }).canPay).toBe(false);
    expect(order({ paymentStatus: 'succeeded', status: 'paid' }).canPay).toBe(false);
  });

  it('описывает доставку по данным заказа', () => {
    const pickup = order({});
    const courier = order({
      delivery: { address: { city: 'Москва', house: '1', street: 'Тверская' }, method: 'courier' },
    });

    expect(pickup.formatDelivery([{ address: 'ул. 1', id: 'point-center', title: 'Центр' }])).toBe(
      'Самовывоз — Центр, ул. 1',
    );
    expect(pickup.formatDelivery([])).toBe('Самовывоз');
    expect(courier.formatDelivery([])).toBe('Курьер — Москва, Тверская, д. 1');
  });
});
