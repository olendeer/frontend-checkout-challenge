import { Cart } from 'domain/cart/entities';

export class Session {
  constructor(
    public readonly id: string,
    public readonly token: string,
    public readonly cart: Cart,
  ) {}
}
