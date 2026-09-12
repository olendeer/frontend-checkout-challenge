import { Order } from 'domain/order';

interface OrderStatusView {
  label: string;
  tone: 'neutral' | 'success' | 'warning' | 'danger';
}

export const getOrderStatusView = (order: Order): OrderStatusView => {
  if (order.isPaid) {
    return { label: 'Оплачен', tone: 'success' };
  }

  if (order.isConfirmedOnDelivery) {
    return { label: 'Оформлен, оплата при получении', tone: 'success' };
  }

  if (order.isPaymentPending) {
    return { label: 'Ожидаем подтверждение оплаты', tone: 'warning' };
  }

  if (order.paymentStatus === 'failed') {
    return { label: 'Оплата отклонена', tone: 'danger' };
  }

  if (order.paymentStatus === 'cancelled') {
    return { label: 'Оплата отменена', tone: 'warning' };
  }

  return { label: 'Ожидает оплаты', tone: 'neutral' };
};
