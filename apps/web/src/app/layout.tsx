import type { Metadata } from 'next';
import { ReactNode } from 'react';

import { AppHeader } from 'features/layout';
import { AppProvider } from 'providers';

import './globals.css';
import styles from './layout.module.css';

export const metadata: Metadata = {
  description: 'Каталог, корзина, оформление заказа и тестовая оплата.',
  title: 'Магазин — оформление заказа',
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="ru">
    <body>
      <AppProvider>
        <a className={styles.skipLink} href="#main">
          Перейти к содержимому
        </a>
        <AppHeader />
        <main className={styles.main} id="main">
          {children}
        </main>
      </AppProvider>
    </body>
  </html>
);

export default RootLayout;
