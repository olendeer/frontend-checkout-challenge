'use client';

import { getErrorMessage } from 'domain/errors';
import { PaymentForm } from 'features/payment';
import { Alert, Button, Card, LinkButton, Spinner, StatusBadge } from 'ui-kit';

import { OrderDetails } from './order-details';
import { useOrderModule } from './order.hooks';
import { getOrderStatusView } from './order.status';
import styles from './order.module.scss';

interface OrderModuleProps {
  orderId: string;
}

export const OrderModule = ({ orderId }: OrderModuleProps) => {
  const { closePaymentForm, isPaymentFormOpen, openPaymentForm, order, payment, pickupPoints } =
    useOrderModule(orderId);

  if (order.isPending) {
    return (
      <Card className={styles.state}>
        <Spinner label="Загружаем заказ" /> Загружаем заказ…
      </Card>
    );
  }

  if (order.isError) {
    return (
      <Alert
        action={
          <Button onClick={() => order.refetch()} size="sm" variant="secondary">
            Повторить
          </Button>
        }
        title="Заказ не загрузился"
      >
        {getErrorMessage(order.error)}
      </Alert>
    );
  }

  const status = getOrderStatusView(order.data);

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <div>
          <p className={styles.caption}>Заказ</p>
          <h1 className={styles.heading}>№ {order.data.number}</h1>
        </div>
        <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
      </header>

      <div aria-live="polite" className={styles.status}>
        {order.data.isPaid ? (
          <Alert title="Заказ оплачен" tone="success">
            Оплата подтверждена сервером. Мы отправили детали на {order.data.customer.email}.
          </Alert>
        ) : null}

        {order.data.isConfirmedOnDelivery ? (
          <Alert title="Заказ оформлен" tone="success">
            Оплата при получении.
          </Alert>
        ) : null}

        {order.data.isPaymentPending ? (
          <Alert title="Ожидаем подтверждение оплаты" tone="warning">
            <Spinner label="Ожидаем подтверждение оплаты" /> Не закрывайте страницу — статус
            обновится автоматически.
          </Alert>
        ) : null}

        {payment.data?.isDeclined ? (
          <Alert title="Банк отклонил оплату">
            Попробуйте другую тестовую карту — заказ сохранён, его можно оплатить снова.
          </Alert>
        ) : null}

        {payment.data?.isCancelled ? (
          <Alert title="Оплата отменена" tone="warning">
            Заказ сохранён. Вы можете оплатить его снова.
          </Alert>
        ) : null}
      </div>

      {order.data.canPay ? (
        <div className={styles.actions}>
          <Button onClick={openPaymentForm}>
            {payment.data ? 'Оплатить снова' : 'Оплатить картой'}
          </Button>
        </div>
      ) : null}

      <OrderDetails order={order.data} pickupPoints={pickupPoints} />

      <div className={styles.actions}>
        <LinkButton href="/" variant="secondary">
          Вернуться в каталог
        </LinkButton>
      </div>

      <PaymentForm
        isOpen={isPaymentFormOpen}
        onClose={closePaymentForm}
        orderId={orderId}
        total={order.data.total}
      />
    </section>
  );
};
