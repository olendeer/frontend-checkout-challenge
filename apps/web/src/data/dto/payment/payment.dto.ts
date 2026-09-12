import type { Payment as PaymentResponse } from '@checkout/contracts';

import { Payment } from 'domain/payment/entities';

export class PaymentDto {
  static mapToEntity(values: PaymentResponse): Payment {
    return new Payment(
      values.id,
      values.orderId,
      values.status,
      values.amount,
      values.currency,
      values.createdAt,
      values.failureCode,
    );
  }

  static mapToEntityList(values: PaymentResponse[]): Payment[] {
    return values.map(PaymentDto.mapToEntity);
  }
}
