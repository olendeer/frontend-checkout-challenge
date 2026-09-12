import type { Quote as QuoteResponse } from '@checkout/contracts';

import { Quote } from 'domain/checkout/entities';

export class QuoteDto {
  static mapToEntity(values: QuoteResponse): Quote {
    return new Quote(
      values.id,
      values.cartVersion,
      values.items,
      values.delivery,
      values.subtotal,
      values.shipping,
      values.total,
      values.currency,
      values.expiresAt,
    );
  }
}
