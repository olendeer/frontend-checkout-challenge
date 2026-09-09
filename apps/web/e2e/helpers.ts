import { expect, Page } from '@playwright/test';

export const LAMP = 'Настольная лампа';
export const OUT_OF_STOCK = 'Часы «Точка»';

export const addToCart = async (page: Page, title: string): Promise<void> => {
  await page.goto('/');
  await page
    .getByRole('listitem')
    .filter({ hasText: title })
    .getByRole('button', { name: 'В корзину' })
    .click();
  await expect(page.getByText(`В корзине: 1`)).toBeVisible();
};

export const fillCustomer = async (page: Page): Promise<void> => {
  await page.getByLabel('Имя и фамилия').fill('Тестовый Покупатель');
  await page.getByLabel('Электронная почта').fill('buyer@example.test');
  await page.getByLabel('Телефон').fill('+79990000000');
};

export const waitForQuote = async (page: Page): Promise<void> => {
  await expect(page.getByText('Пересчитываем стоимость…')).toBeHidden();
  await expect(page.getByRole('button', { name: /Оформить/ })).toBeEnabled();
};

export const payWithCard = async (page: Page, cardName: RegExp): Promise<void> => {
  await page.getByRole('radio', { name: cardName }).check();
  await page.getByRole('button', { name: 'Оплатить', exact: true }).click();
};
