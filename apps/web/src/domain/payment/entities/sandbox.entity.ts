import { SandboxCard } from 'domain/contracts';

export class Sandbox {
  constructor(
    public readonly settlementDelayMs: number,
    public readonly cards: SandboxCard[],
  ) {}
}
