import { beforeEach, describe, expect, it, vi } from 'vitest';

import { IdempotencyJournal } from 'core/idempotency';
import { AppStorage } from 'core/storage';

const createStorage = (): AppStorage => {
  const values = new Map<string, unknown>();

  return {
    read: <TValue>(key: string) => (values.get(key) as TValue) ?? null,
    remove: (key: string) => void values.delete(key),
    write: <TValue>(key: string, value: TValue) => void values.set(key, value),
  };
};

describe('журнал ключей идемпотентности', () => {
  beforeEach(() => {
    let counter = 0;

    vi.stubGlobal('crypto', { randomUUID: () => `key-${++counter}` });
  });

  it('повторяет тот же ключ для того же тела запроса', () => {
    const journal = new IdempotencyJournal(createStorage());
    const body = { quoteId: 'q1' };

    expect(journal.keyFor('order:create', body)).toBe('key-1');
    expect(journal.keyFor('order:create', { quoteId: 'q1' })).toBe('key-1');
  });

  it('выдаёт новый ключ, когда тело изменилось', () => {
    const journal = new IdempotencyJournal(createStorage());

    expect(journal.keyFor('order:create', { quoteId: 'q1' })).toBe('key-1');
    expect(journal.keyFor('order:create', { quoteId: 'q2' })).toBe('key-2');
  });

  it('после release начинает новую попытку с новым ключом', () => {
    const journal = new IdempotencyJournal(createStorage());

    expect(journal.keyFor('payment:o1', { orderId: 'o1' })).toBe('key-1');

    journal.release('payment:o1');

    expect(journal.keyFor('payment:o1', { orderId: 'o1' })).toBe('key-2');
  });

  it('не задевает соседние намерения при release', () => {
    const journal = new IdempotencyJournal(createStorage());

    journal.keyFor('order:create', { quoteId: 'q1' });
    journal.keyFor('payment:o1', { orderId: 'o1' });
    journal.release('payment:o1');

    expect(journal.keyFor('order:create', { quoteId: 'q1' })).toBe('key-1');
  });
});
