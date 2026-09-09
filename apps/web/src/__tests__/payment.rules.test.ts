import { describe, expect, it } from 'vitest';

import { Payment } from 'domain/contracts';
import {
  getIsPaymentCancelled,
  getIsPaymentDeclined,
  getIsPaymentTerminal,
  getLatestPayment,
} from 'domain/payment';

const payment = (status: Payment['status'], id = 'p1'): Payment => ({
  amount: 1000,
  createdAt: '2026-09-09T00:00:00.000Z',
  currency: 'RUB',
  failureCode: status === 'failed' ? 'CARD_DECLINED' : null,
  id,
  orderId: 'o1',
  status,
});

describe('правила оплаты', () => {
  it('останавливает опрос только на завершённых статусах', () => {
    expect(getIsPaymentTerminal(payment('pending'))).toBe(false);
    expect(getIsPaymentTerminal(payment('processing'))).toBe(false);
    expect(getIsPaymentTerminal(payment('succeeded'))).toBe(true);
    expect(getIsPaymentTerminal(payment('failed'))).toBe(true);
    expect(getIsPaymentTerminal(payment('cancelled'))).toBe(true);
    expect(getIsPaymentTerminal(null)).toBe(false);
  });

  it('различает отказ карты и отмену', () => {
    expect(getIsPaymentDeclined(payment('failed'))).toBe(true);
    expect(getIsPaymentCancelled(payment('failed'))).toBe(false);
    expect(getIsPaymentCancelled(payment('cancelled'))).toBe(true);
  });

  it('берёт последнюю попытку из списка от новых к старым', () => {
    expect(getLatestPayment([payment('failed', 'new'), payment('cancelled', 'old')])?.id).toBe(
      'new',
    );
    expect(getLatestPayment([])).toBeNull();
  });
});
