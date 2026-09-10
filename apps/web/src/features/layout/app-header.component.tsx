'use client';

import Link from 'next/link';

import { useCartQuery } from 'query';

import styles from './app-header.module.scss';

export const AppHeader = () => {
  const cart = useCartQuery();
  const quantity = cart.data?.quantity ?? 0;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} href="/">
          Магазин
        </Link>
        <nav aria-label="Основная навигация" className={styles.nav}>
          <Link className={styles.link} href="/">
            Каталог
          </Link>
          <Link className={styles.link} href="/cart">
            Корзина
            <span aria-hidden="true" className={styles.badge}>
              {quantity}
            </span>
            <span className="visually-hidden">, товаров: {quantity}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};
