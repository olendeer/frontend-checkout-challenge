import {
  CartItem,
  Currency,
  Customer,
  Delivery,
  OrderPaymentStatus,
  OrderStatus,
  PaymentMethod,
  PickupPoint,
} from 'domain/contracts';

const PENDING_PAYMENT_STATUSES: OrderPaymentStatus[] = ['pending'];

export class Order {
  constructor(
    public readonly id: string,
    public readonly number: string,
    public readonly status: OrderStatus,
    public readonly paymentStatus: OrderPaymentStatus,
    public readonly paymentMethod: PaymentMethod,
    public readonly customer: Customer,
    public readonly items: CartItem[],
    public readonly delivery: Delivery,
    public readonly subtotal: number,
    public readonly shipping: number,
    public readonly total: number,
    public readonly currency: Currency,
    public readonly createdAt: string,
  ) {}

  get isCard(): boolean {
    return this.paymentMethod === 'card';
  }

  get isPaid(): boolean {
    return this.status === 'paid' && this.paymentStatus === 'succeeded';
  }

  get isConfirmedOnDelivery(): boolean {
    return this.paymentMethod === 'cash_on_delivery' && this.status === 'confirmed';
  }

  get isComplete(): boolean {
    return this.isPaid || this.isConfirmedOnDelivery;
  }

  get isPaymentPending(): boolean {
    return PENDING_PAYMENT_STATUSES.includes(this.paymentStatus);
  }

  // Повторная оплата возможна, пока заказ не оплачен и предыдущая попытка не в работе.
  get canPay(): boolean {
    if (!this.isCard || this.isPaid) {
      return false;
    }

    return !this.isPaymentPending;
  }

  formatDelivery(points: PickupPoint[]): string {
    const { delivery } = this;

    if (delivery.method === 'pickup') {
      const point = points.find((item) => item.id === delivery.pickupPointId);

      return point ? `Самовывоз — ${point.title}, ${point.address}` : 'Самовывоз';
    }

    const { address } = delivery;
    const apartment = address.apartment ? `, кв. ${address.apartment}` : '';

    return `Курьер — ${address.city}, ${address.street}, д. ${address.house}${apartment}`;
  }
}
