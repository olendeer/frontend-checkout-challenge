import type { Static } from '@sinclair/typebox';
import type {
  Cart,
  CheckoutOptionsSchema,
  Order,
  Payment,
  SandboxSchema,
  SessionSchema,
} from '@checkout/contracts';

export type {
  Cart,
  CreateOrder,
  Customer,
  Delivery,
  Order,
  Payment,
  Product,
  Quote,
  Scenario,
  Simulation,
} from '@checkout/contracts';

export type Session = Static<typeof SessionSchema>;
export type CheckoutOptions = Static<typeof CheckoutOptionsSchema>;
export type Sandbox = Static<typeof SandboxSchema>;

export type CartItem = Cart['items'][number];
export type SandboxCard = Sandbox['cards'][number];
export type DeliveryMethod = CheckoutOptions['deliveryMethods'][number];
export type DeliveryMethodId = DeliveryMethod['id'];
export type PickupPoint = DeliveryMethod['pickupPoints'][number];
export type PaymentMethod = Order['paymentMethod'];
export type OrderStatus = Order['status'];
export type PaymentStatus = Payment['status'];
export type OrderPaymentStatus = Order['paymentStatus'];
