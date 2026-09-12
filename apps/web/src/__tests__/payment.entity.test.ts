import type { Payment as PaymentResponse } from '@checkout/contracts';
import { describe, expect, it } from 'vitest';

import { PaymentDto } from 'data/dto/payment';
import { Payment } from 'domain/payment';

const payment = (status: PaymentResponse['status'], id = 'p1'): Payment =>
  PaymentDto.mapToEntity({
    amount: 1000,
    createdAt: '2026-09-09T00:00:00.000Z',
    currency: 'RUB',
    failureCode: status === 'failed' ? 'CARD_DECLINED' : null,
    id,
    orderId: 'o1',
    status,
  });

describe('оплата', () => {
  it('останавливает опрос только на завершённых статусах', () => {
    expect(payment('pending').isTerminal).toBe(false);
    expect(payment('processing').isTerminal).toBe(false);
    expect(payment('succeeded').isTerminal).toBe(true);
    expect(payment('failed').isTerminal).toBe(true);
    expect(payment('cancelled').isTerminal).toBe(true);
  });

  it('различает отказ карты и отмену', () => {
    expect(payment('failed').isDeclined).toBe(true);
    expect(payment('failed').isCancelled).toBe(false);
    expect(payment('cancelled').isCancelled).toBe(true);
  });

  it('берёт последнюю попытку из списка от новых к старым', () => {
    expect(Payment.latest([payment('failed', 'new'), payment('cancelled', 'old')])?.id).toBe('new');
    expect(Payment.latest([])).toBeNull();
  });
});
