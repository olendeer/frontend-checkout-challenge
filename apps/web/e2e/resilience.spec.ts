import { expect, test } from '@playwright/test';

import { addToCart, fillCustomer, LAMP, waitForQuote } from './helpers';

test('сбой сети при расчёте не стирает форму и предлагает повтор', async ({ page }) => {
  await addToCart(page, LAMP);

  await page.goto('/checkout');
  await fillCustomer(page);
  await waitForQuote(page);

  await page.route('**/api/quotes', (route) => route.abort('failed'));
  await page.getByRole('radio', { name: /Курьер/ }).check();
  await page.getByLabel('Город').fill('Учебный');
  await page.getByLabel('Улица').fill('Примерная');
  await page.getByLabel('Дом').fill('10');

  await expect(page.getByText('Не удалось рассчитать доставку')).toBeVisible({ timeout: 20_000 });
  await expect(page.getByLabel('Имя и фамилия')).toHaveValue('Тестовый Покупатель');
  await expect(page.getByLabel('Электронная почта')).toHaveValue('buyer@example.test');
  await expect(page.getByLabel('Город')).toHaveValue('Учебный');
  await expect(page.getByRole('button', { name: 'Оформить и перейти к оплате' })).toBeDisabled();

  await page.unroute('**/api/quotes');
  await page.getByRole('button', { name: 'Пересчитать' }).click();

  await expect(page.getByTestId('summary-shipping')).toHaveText('390 ₽', { timeout: 20_000 });
  await expect(page.getByRole('button', { name: 'Оформить и перейти к оплате' })).toBeEnabled();
});

test('потерянный ответ на создание заказа не создаёт второй заказ при повторе', async ({
  page,
  request,
}) => {
  await addToCart(page, LAMP);

  await page.goto('/checkout');
  await fillCustomer(page);
  await waitForQuote(page);

  await page.route('**/api/orders', async (route) => {
    await route.fetch();
    await route.abort('failed');
  });

  await page.getByRole('button', { name: 'Оформить и перейти к оплате' }).click();
  await expect(page.getByText('Заказ не создан')).toBeVisible({ timeout: 20_000 });

  await page.unroute('**/api/orders');
  await page.getByRole('button', { name: 'Оформить и перейти к оплате' }).click();
  await expect(page).toHaveURL(/\/orders\//, { timeout: 20_000 });

  const token = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem('checkout.session.token') ?? 'null'),
  );
  const response = await request.get('http://localhost:4000/api/orders', {
    headers: { Authorization: `Bearer ${token}` },
  });

  expect((await response.json()).data).toHaveLength(1);
});

test('сессия восстанавливается после сброса токена', async ({ page }) => {
  await addToCart(page, LAMP);

  await page.evaluate(() => window.localStorage.removeItem('checkout.session.token'));
  await page.goto('/cart');

  await expect(page.getByText('Корзина пуста')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Перейти в каталог' })).toBeVisible();
});
