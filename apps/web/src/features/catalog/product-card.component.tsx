import { getIsProductAvailable, getMaxQuantity } from 'domain/cart';
import { Product } from 'domain/contracts';
import { Button, Card, Money, StatusBadge } from 'ui-kit';

import styles from './product-card.module.css';

interface ProductCardProps {
  isPending: boolean;
  onAdd: (product: Product) => void;
  product: Product;
  quantityInCart: number;
}

export const ProductCard = ({ isPending, onAdd, product, quantityInCart }: ProductCardProps) => {
  const isAvailable = getIsProductAvailable(product);
  const isLimitReached = quantityInCart >= getMaxQuantity(product);

  return (
    <Card as="li" className={styles.card}>
      <div className={styles.head}>
        <h2 className={styles.title}>{product.title}</h2>
        {isAvailable ? (
          <StatusBadge tone="neutral">Остаток: {product.stock}</StatusBadge>
        ) : (
          <StatusBadge tone="danger">Нет в наличии</StatusBadge>
        )}
      </div>
      <p className={styles.description}>{product.description}</p>
      <p className={styles.price}>
        <Money value={product.price} />
      </p>
      <div className={styles.footer}>
        <Button
          disabled={!isAvailable || isLimitReached}
          isLoading={isPending}
          onClick={() => onAdd(product)}
        >
          {isLimitReached && isAvailable ? 'Больше нет в наличии' : 'В корзину'}
        </Button>
        {quantityInCart > 0 ? (
          <span className={styles.inCart}>В корзине: {quantityInCart}</span>
        ) : null}
      </div>
    </Card>
  );
};
