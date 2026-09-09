import { Payment, PaymentStatus } from 'domain/contracts';

const TERMINAL_STATUSES: PaymentStatus[] = ['succeeded', 'failed', 'cancelled'];

export const getIsPaymentTerminal = (payment?: Payment | null): boolean =>
  Boolean(payment) && TERMINAL_STATUSES.includes(payment!.status);

export const getIsPaymentDeclined = (payment?: Payment | null): boolean =>
  payment?.status === 'failed';

export const getIsPaymentCancelled = (payment?: Payment | null): boolean =>
  payment?.status === 'cancelled';

export const getLatestPayment = (payments: Payment[]): Payment | null => payments[0] ?? null;
