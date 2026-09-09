import { expect, Page, test } from '@playwright/test';

import { addToCart, fillCustomer, LAMP, waitForQuote } from './helpers';

const VIEWPORTS = [
  { height: 800, name: 'desktop-1280', width: 1280 },
  { height: 844, name: 'mobile-390', width: 390 },
];

const getHasHorizontalScroll = (page: Page): Promise<boolean> =>
  page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );

for (const viewport of VIEWPORTS) {
  test(`сценарий проходит без горизонтальной прокрутки: ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ height: viewport.height, width: viewport.width });

    await addToCart(page, LAMP);
    expect(await getHasHorizontalScroll(page)).toBe(false);
    await page.screenshot({ path: `screenshots/${viewport.name}-catalog.png`, fullPage: true });

    await page.goto('/cart');
    await expect(page.getByRole('link', { name: 'Перейти к оформлению' })).toBeVisible();
    expect(await getHasHorizontalScroll(page)).toBe(false);
    await page.screenshot({ path: `screenshots/${viewport.name}-cart.png`, fullPage: true });

    await page.goto('/checkout');
    await fillCustomer(page);
    await page.getByRole('radio', { name: /Курьер/ }).check();
    await page.getByLabel('Город').fill('Учебный');
    await page.getByLabel('Улица').fill('Примерная');
    await page.getByLabel('Дом').fill('10');
    await waitForQuote(page);
    expect(await getHasHorizontalScroll(page)).toBe(false);
    await page.screenshot({ path: `screenshots/${viewport.name}-checkout.png`, fullPage: true });

    await page.getByRole('button', { name: 'Оформить и перейти к оплате' }).click();
    await expect(page).toHaveURL(/\/orders\//);
    await page.screenshot({ path: `screenshots/${viewport.name}-payment.png` });

    await page.getByRole('radio', { name: /успешная оплата/ }).check();
    await page.getByRole('button', { name: 'Оплатить', exact: true }).click();
    await expect(page.getByText('Заказ оплачен')).toBeVisible({ timeout: 20_000 });
    expect(await getHasHorizontalScroll(page)).toBe(false);
    await page.screenshot({ path: `screenshots/${viewport.name}-order.png`, fullPage: true });
  });
}

test('форму оформления можно заполнить и отправить с клавиатуры', async ({ page }) => {
  await addToCart(page, LAMP);
  await page.goto('/checkout');

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Перейти к содержимому' })).toBeFocused();

  await page.getByLabel('Имя и фамилия').focus();
  await page.keyboard.type('Тестовый Покупатель');
  await page.keyboard.press('Tab');
  await page.keyboard.type('buyer@example.test');
  await page.keyboard.press('Tab');
  await page.keyboard.type('+79990000000');

  await waitForQuote(page);

  await page.getByRole('button', { name: 'Оформить и перейти к оплате' }).focus();
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/\/orders\//);
  await expect(page.getByRole('dialog')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
});
