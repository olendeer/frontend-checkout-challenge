const KOPEKS_IN_RUBLE = 100;

const formatter = new Intl.NumberFormat('ru-RU', {
  currency: 'RUB',
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
  style: 'currency',
});

export const formatMoney = (kopeks: number): string => formatter.format(kopeks / KOPEKS_IN_RUBLE);
