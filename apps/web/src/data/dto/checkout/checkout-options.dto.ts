import type { Static } from '@sinclair/typebox';
import type { CheckoutOptionsSchema } from '@checkout/contracts';

import { CartDto } from 'data/dto/cart';
import { CheckoutOptions } from 'domain/checkout/entities';

type CheckoutOptionsResponse = Static<typeof CheckoutOptionsSchema>;

export class CheckoutOptionsDto {
  static mapToEntity(values: CheckoutOptionsResponse): CheckoutOptions {
    return new CheckoutOptions(
      CartDto.mapToEntity(values.cart),
      values.deliveryMethods,
      values.paymentMethods,
    );
  }
}
