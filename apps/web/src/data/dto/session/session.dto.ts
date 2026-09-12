import type { Static } from '@sinclair/typebox';
import type { SessionSchema } from '@checkout/contracts';

import { CartDto } from 'data/dto/cart';
import { Session } from 'domain/session/entities';

type SessionResponse = Static<typeof SessionSchema>;

export class SessionDto {
  static mapToEntity(values: SessionResponse): Session {
    return new Session(values.id, values.token, CartDto.mapToEntity(values.cart));
  }
}
