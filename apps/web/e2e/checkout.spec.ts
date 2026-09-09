import { expect, test } from '@playwright/test';

import { addToCart, fillCustomer, LAMP, OUT_OF_STOCK, payWithCard, waitForQuote } from './helpers';

test('оплата картой доходит до подтверждённого статуса заказа', async ({ page }) => {
  await addToCart(page, LAMP);

  await page.goto('/checkout');
  await fillCustomer(page);
  await waitForQuote(page);

  await page.getByRole('button', { name: 'Оформить и перейти к оплате' }).click();
  await expect(page).toHaveURL(/\/orders\//);

  await payWithCard(page, /успешная оплата/);

  await expect(page.getByText('Заказ оплачен')).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText('Оплачен', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /№/ })).toBeVisible();
  await expect(page.getByText(LAMP)).toBeVisible();
});

test('отказ карты сохраняет заказ и допускает повторную оплату', async ({ page }) => {
  await addToCart(page, LAMP);

  await page.goto('/checkout');
  await fillCustomer(page);
  await waitForQuote(page);
  await page.getByRole('button', { name: 'Оформить и перейти к оплате' }).click();

  await payWithCard(page, /отказ банка/);
  await expect(page.getByText('Банк отклонил оплату')).toBeVisible({ timeout: 20_000 });

  await page.getByRole('button', { name: 'Оплатить снова' }).click();
  await payWithCard(page, /успешная оплата/);
  await expect(page.getByText('Заказ оплачен')).toBeVisible({ timeout: 20_000 });
});

test('отмена оплаты отличается от отказа и допускает повтор', async ({ page }) => {
  await addToCart(page, LAMP);

  await page.goto('/checkout');
  await fillCustomer(page);
  await waitForQuote(page);
  await page.getByRole('button', { name: 'Оформить и перейти к оплате' }).click();

  await page.getByRole('button', { name: 'Отменить оплату' }).click();
  await expect(page.getByText('Заказ сохранён. Вы можете оплатить его снова.')).toBeVisible({
    timeout: 20_000,
  });

  await page.getByRole('button', { name: 'Оплатить снова' }).click();
  await payWithCard(page, /успешная оплата/);
  await expect(page.getByText('Заказ оплачен')).toBeVisible({ timeout: 20_000 });
});

test('наличные при получении завершаются без онлайн-оплаты', async ({ page }) => {
  await addToCart(page, LAMP);

  await page.goto('/checkout');
  await fillCustomer(page);
  await page.getByRole('radio', { name: /Наличными при получении/ }).check();
  await waitForQuote(page);

  await page.getByRole('button', { name: 'Оформить заказ' }).click();

  await expect(page.getByText('Оформлен, оплата при получении')).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText('Оплата при получении.')).toBeVisible();
  await expect(page.getByRole('button', { name: /Оплатить/ })).toHaveCount(0);
});

test('курьерская доставка добавляет стоимость доставки из API', async ({ page }) => {
  await addToCart(page, LAMP);

  await page.goto('/checkout');
  await fillCustomer(page);
  await waitForQuote(page);
  await expect(page.getByTestId('summary-shipping')).toHaveText('0 ₽');

  await page.getByRole('radio', { name: /Курьер/ }).check();
  await page.getByLabel('Город').fill('Учебный');
  await page.getByLabel('Улица').fill('Примерная');
  await page.getByLabel('Дом').fill('10');
  await waitForQuote(page);

  await expect(page.getByTestId('summary-shipping')).toHaveText('390 ₽');
});

test('пустую корзину нельзя оформить, недоступный товар не добавляется', async ({ page }) => {
  await page.goto('/');
  await expect(
    page
      .getByRole('listitem')
      .filter({ hasText: OUT_OF_STOCK })
      .getByRole('button', { name: 'В корзину' }),
  ).toBeDisabled();

  await page.goto('/checkout');
  await expect(page.getByText('Корзина пуста')).toBeVisible();
});

test('двойное нажатие «Оформить» не создаёт второй заказ', async ({ page, request }) => {
  await addToCart(page, LAMP);

  await page.goto('/checkout');
  await fillCustomer(page);
  await waitForQuote(page);

  const submit = page.getByRole('button', { name: 'Оформить и перейти к оплате' });

  await submit.dispatchEvent('click');
  await submit.dispatchEvent('click');

  await expect(page).toHaveURL(/\/orders\//, { timeout: 20_000 });

  const token = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem('checkout.session.token') ?? 'null'),
  );
  const response = await request.get('http://localhost:4000/api/orders', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await response.json();

  expect(body.data).toHaveLength(1);
});

test('перезагрузка во время ожидания оплаты доводит статус до результата', async ({ page }) => {
  await addToCart(page, LAMP);

  await page.goto('/checkout');
  await fillCustomer(page);
  await waitForQuote(page);
  await page.getByRole('button', { name: 'Оформить и перейти к оплате' }).click();

  await payWithCard(page, /успешная оплата/);
  await page.reload();

  await expect(page.getByText('Заказ оплачен')).toBeVisible({ timeout: 20_000 });
});
