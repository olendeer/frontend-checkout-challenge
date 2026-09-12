import { CartItem, Currency, Delivery } from 'domain/contracts';

export class Quote {
  constructor(
    public readonly id: string,
    public readonly cartVersion: number,
    public readonly items: CartItem[],
    public readonly delivery: Delivery,
    public readonly subtotal: number,
    public readonly shipping: number,
    public readonly total: number,
    public readonly currency: Currency,
    public readonly expiresAt: string,
  ) {}

  get isExpired(): boolean {
    return new Date(this.expiresAt).getTime() <= Date.now();
  }
}
