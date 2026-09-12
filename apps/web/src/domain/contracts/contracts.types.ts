import type { Static } from '@sinclair/typebox';
import type {
  AddressSchema,
  CartSchema,
  CheckoutOptionsSchema,
  OrderSchema,
  PaymentSchema,
  ProductSchema,
  SandboxSchema,
} from '@checkout/contracts';

// Значимые типы контракта: их домен использует как есть. Агрегаты, которые приходят от API
// целиком, поднимаются наверх сущностями из domain/<область>/entities.
export type { CreateOrder, Customer, Delivery, Scenario } from '@checkout/contracts';

type CheckoutOptionsResponse = Static<typeof CheckoutOptionsSchema>;
type OrderResponse = Static<typeof OrderSchema>;

export type Address = Static<typeof AddressSchema>;
export type CartItem = Static<typeof CartSchema>['items'][number];
export type Currency = Static<typeof ProductSchema>['currency'];
export type DeliveryMethod = CheckoutOptionsResponse['deliveryMethods'][number];
export type DeliveryMethodId = DeliveryMethod['id'];
export type PickupPoint = DeliveryMethod['pickupPoints'][number];
export type PaymentMethodOption = CheckoutOptionsResponse['paymentMethods'][number];
export type SandboxCard = Static<typeof SandboxSchema>['cards'][number];
export type PaymentMethod = OrderResponse['paymentMethod'];
export type OrderStatus = OrderResponse['status'];
export type OrderPaymentStatus = OrderResponse['paymentStatus'];
export type PaymentStatus = Static<typeof PaymentSchema>['status'];
