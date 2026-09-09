import { Order, OrderPaymentStatus } from 'domain/contracts';

const PENDING_PAYMENT_STATUSES: OrderPaymentStatus[] = ['pending'];

export const getIsCardOrder = (order: Order): boolean => order.paymentMethod === 'card';

export const getIsOrderPaid = (order: Order): boolean =>
  order.status === 'paid' && order.paymentStatus === 'succeeded';

export const getIsOrderConfirmedOnDelivery = (order: Order): boolean =>
  order.paymentMethod === 'cash_on_delivery' && order.status === 'confirmed';

export const getIsOrderComplete = (order: Order): boolean =>
  getIsOrderPaid(order) || getIsOrderConfirmedOnDelivery(order);

export const getIsPaymentPending = (order: Order): boolean =>
  PENDING_PAYMENT_STATUSES.includes(order.paymentStatus);

export const getCanPayOrder = (order: Order): boolean => {
  if (!getIsCardOrder(order) || getIsOrderPaid(order)) {
    return false;
  }

  return !getIsPaymentPending(order);
};
