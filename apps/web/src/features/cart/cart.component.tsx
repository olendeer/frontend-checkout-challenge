'use client';

import { getIsCartEmpty } from 'domain/cart';
import { getErrorMessage } from 'domain/errors';
import { Alert, Button, Card, EmptyState, LinkButton, Money, Spinner } from 'ui-kit';

import { CartLine } from './cart-line';
import { useCartModule } from './cart.hooks';
import styles from './cart.module.css';

export const CartModule = () => {
  const { cart, changeError, pendingProductId, removeItem, setQuantity, stockIndex } =
    useCartModule();

  if (cart.isPending) {
    return (
      <Card className={styles.state}>
        <Spinner label="Загружаем корзину" /> Загружаем корзину…
      </Card>
    );
  }

  if (cart.isError) {
    return (
      <Alert
        action={
          <Button onClick={() => cart.refetch()} size="sm" variant="secondary">
            Повторить
          </Button>
        }
        title="Корзина не загрузилась"
      >
        {getErrorMessage(cart.error)}
      </Alert>
    );
  }

  if (getIsCartEmpty(cart.data)) {
    return (
      <section className={styles.section}>
        <h1 className={styles.heading}>Корзина</h1>
        <EmptyState
          action={<LinkButton href="/">Перейти в каталог</LinkButton>}
          description="Добавьте товары из каталога, чтобы оформить заказ."
          title="Корзина пуста"
        />
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <h1 className={styles.heading}>Корзина</h1>

      {changeError ? (
        <Alert title="Не удалось изменить корзину">{getErrorMessage(changeError)}</Alert>
      ) : null}

      <Card>
        <ul>
          {cart.data.items.map((item) => (
            <CartLine
              isPending={pendingProductId === item.productId}
              item={item}
              key={item.productId}
              maxQuantity={stockIndex.get(item.productId) ?? item.quantity}
              onQuantityChange={setQuantity}
              onRemove={removeItem}
            />
          ))}
        </ul>
      </Card>

      <Card className={styles.summary}>
        <div className={styles.total}>
          <span>Товары ({cart.data.quantity} шт.)</span>
          <strong className={styles.totalValue}>
            <Money value={cart.data.subtotal} />
          </strong>
        </div>
        <p className={styles.note}>Стоимость доставки рассчитается на шаге оформления.</p>
        <LinkButton href="/checkout" isFullWidth>
          Перейти к оформлению
        </LinkButton>
      </Card>
    </section>
  );
};
