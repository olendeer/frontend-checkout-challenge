import { Cart } from 'domain/cart/entities';
import { DeliveryMethod, PaymentMethodOption, PickupPoint } from 'domain/contracts';

export class CheckoutOptions {
  constructor(
    public readonly cart: Cart,
    public readonly deliveryMethods: DeliveryMethod[],
    public readonly paymentMethods: PaymentMethodOption[],
  ) {}

  get pickupPoints(): PickupPoint[] {
    return this.deliveryMethods.find((method) => method.id === 'pickup')?.pickupPoints ?? [];
  }
}
