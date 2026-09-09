import { describe, expect, it } from 'vitest';

import { Order } from 'domain/contracts';
import {
  getCanPayOrder,
  getIsOrderComplete,
  getIsOrderConfirmedOnDelivery,
  getIsOrderPaid,
} from 'domain/order';

const order = (values: Partial<Order>): Order => ({
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

describe('правила заказа', () => {
  it('считает заказ оплаченным только по статусу с сервера', () => {
    expect(getIsOrderPaid(order({ paymentStatus: 'succeeded', status: 'paid' }))).toBe(true);
    expect(getIsOrderPaid(order({ paymentStatus: 'succeeded', status: 'awaiting_payment' }))).toBe(
      false,
    );
    expect(getIsOrderPaid(order({ paymentStatus: 'pending', status: 'paid' }))).toBe(false);
  });

  it('завершает наличный заказ без онлайн-оплаты', () => {
    const cash = order({ paymentMethod: 'cash_on_delivery', status: 'confirmed' });

    expect(getIsOrderConfirmedOnDelivery(cash)).toBe(true);
    expect(getIsOrderComplete(cash)).toBe(true);
    expect(getCanPayOrder(cash)).toBe(false);
  });

  it('разрешает повтор оплаты после отказа и отмены, но не во время обработки', () => {
    expect(getCanPayOrder(order({ paymentStatus: 'failed' }))).toBe(true);
    expect(getCanPayOrder(order({ paymentStatus: 'cancelled' }))).toBe(true);
    expect(getCanPayOrder(order({ paymentStatus: 'pending' }))).toBe(false);
    expect(getCanPayOrder(order({ paymentStatus: 'succeeded', status: 'paid' }))).toBe(false);
  });
});
