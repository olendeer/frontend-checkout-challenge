import { Currency, PaymentStatus } from 'domain/contracts';

const TERMINAL_STATUSES: PaymentStatus[] = ['succeeded', 'failed', 'cancelled'];

export class Payment {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly status: PaymentStatus,
    public readonly amount: number,
    public readonly currency: Currency,
    public readonly createdAt: string,
    public readonly failureCode: 'CARD_DECLINED' | null,
  ) {}

  get isTerminal(): boolean {
    return TERMINAL_STATUSES.includes(this.status);
  }

  get isDeclined(): boolean {
    return this.status === 'failed';
  }

  get isCancelled(): boolean {
    return this.status === 'cancelled';
  }

  // API отдаёт попытки от новой к старой.
  static latest(payments: Payment[]): Payment | null {
    return payments[0] ?? null;
  }
}
