'use client';

import { getErrorMessage } from 'domain/errors';
import { Alert, Button, Card, Spinner } from 'ui-kit';

import { useCatalogModule } from './catalog.hooks';
import { ProductCard } from './product-card';
import styles from './catalog.module.css';

export const CatalogModule = () => {
  const { addToCart, addToCartError, pendingProductId, products, quantityIndex } =
    useCatalogModule();

  return (
    <section className={styles.section}>
      <h1 className={styles.heading}>Каталог</h1>

      {addToCartError ? (
        <Alert title="Не удалось изменить корзину">{getErrorMessage(addToCartError)}</Alert>
      ) : null}

      {products.isPending ? (
        <Card className={styles.state}>
          <Spinner label="Загружаем каталог" /> Загружаем каталог…
        </Card>
      ) : null}

      {products.isError ? (
        <Alert
          action={
            <Button onClick={() => products.refetch()} size="sm" variant="secondary">
              Повторить
            </Button>
          }
          title="Каталог не загрузился"
        >
          {getErrorMessage(products.error)}
        </Alert>
      ) : null}

      {products.data ? (
        <ul className={styles.grid}>
          {products.data.map((product) => (
            <ProductCard
              isPending={pendingProductId === product.id}
              key={product.id}
              onAdd={addToCart}
              product={product}
              quantityInCart={quantityIndex.get(product.id) ?? 0}
            />
          ))}
        </ul>
      ) : null}
    </section>
  );
};
