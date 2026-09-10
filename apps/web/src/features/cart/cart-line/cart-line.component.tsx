import { CartItem } from 'domain/contracts';
import { Button, Money } from 'ui-kit';

import styles from './cart-line.module.css';

interface CartLineProps {
  isPending: boolean;
  item: CartItem;
  maxQuantity: number;
  onRemove: (productId: string) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
}

export const CartLine = ({
  isPending,
  item,
  maxQuantity,
  onQuantityChange,
  onRemove,
}: CartLineProps) => (
  <li className={styles.line}>
    <div className={styles.info}>
      <span className={styles.title}>{item.title}</span>
      <span className={styles.unitPrice}>
        <Money value={item.unitPrice} /> за штуку
      </span>
    </div>

    <div aria-label={`Количество: ${item.title}`} className={styles.stepper} role="group">
      <Button
        aria-label="Уменьшить количество"
        disabled={isPending || item.quantity <= 1}
        onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
        size="sm"
        variant="secondary"
      >
        −
      </Button>
      <output className={styles.quantity}>{item.quantity}</output>
      <Button
        aria-label="Увеличить количество"
        disabled={isPending || item.quantity >= maxQuantity}
        onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
        size="sm"
        variant="secondary"
      >
        +
      </Button>
    </div>

    <span className={styles.lineTotal}>
      <Money value={item.lineTotal} />
    </span>

    <Button
      disabled={isPending}
      onClick={() => onRemove(item.productId)}
      size="sm"
      variant="danger"
    >
      Удалить
    </Button>
  </li>
);
