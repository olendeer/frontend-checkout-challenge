import { formatDelivery } from 'domain/checkout';
import { Order, PickupPoint } from 'domain/contracts';
import { Card, Money } from 'ui-kit';

import styles from './order-details.module.scss';

interface OrderDetailsProps {
  order: Order;
  pickupPoints: PickupPoint[];
}

export const OrderDetails = ({ order, pickupPoints }: OrderDetailsProps) => (
  <Card className={styles.details}>
    <section className={styles.block}>
      <h2 className={styles.heading}>Состав заказа</h2>
      <ul className={styles.items}>
        {order.items.map((item) => (
          <li className={styles.item} key={item.productId}>
            <span>
              {item.title}
              <span className={styles.quantity}> × {item.quantity}</span>
            </span>
            <span className={styles.value}>
              <Money value={item.lineTotal} />
            </span>
          </li>
        ))}
      </ul>
    </section>

    <section className={styles.block}>
      <h2 className={styles.heading}>Доставка</h2>
      <p>{formatDelivery(order.delivery, pickupPoints)}</p>
    </section>

    <section className={styles.block}>
      <h2 className={styles.heading}>Получатель</h2>
      <p>{order.customer.name}</p>
      <p className={styles.muted}>
        {order.customer.email} · {order.customer.phone}
      </p>
    </section>

    <dl className={styles.totals}>
      <div className={styles.row}>
        <dt>Товары</dt>
        <dd>
          <Money value={order.subtotal} />
        </dd>
      </div>
      <div className={styles.row}>
        <dt>Доставка</dt>
        <dd>
          <Money value={order.shipping} />
        </dd>
      </div>
      <div className={[styles.row, styles.total].join(' ')}>
        <dt>Итого</dt>
        <dd>
          <Money value={order.total} />
        </dd>
      </div>
    </dl>
  </Card>
);
