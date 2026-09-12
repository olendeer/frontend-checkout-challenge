import type { Static } from '@sinclair/typebox';
import type { SandboxSchema } from '@checkout/contracts';

import { Sandbox } from 'domain/payment/entities';

type SandboxResponse = Static<typeof SandboxSchema>;

export class SandboxDto {
  static mapToEntity(values: SandboxResponse): Sandbox {
    return new Sandbox(values.settlementDelayMs, values.cards);
  }
}
