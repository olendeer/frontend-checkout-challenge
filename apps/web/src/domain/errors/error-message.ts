import { HttpError, HttpErrorCodes, HttpErrorMessage } from 'core/http';

import { ApiErrorCodes } from './error-codes';

const MESSAGES: Record<string, string> = {
  [ApiErrorCodes.CART_EMPTY]: 'Корзина пуста. Добавьте товары, чтобы оформить заказ.',
  [ApiErrorCodes.CART_ITEM_NOT_FOUND]: 'Этой позиции больше нет в корзине.',
  [ApiErrorCodes.CART_VERSION_CONFLICT]:
    'Корзина изменилась. Мы обновили расчёт — проверьте сумму и продолжите оформление.',
  [ApiErrorCodes.IDEMPOTENCY_CONFLICT]:
    'Данные заказа изменились с прошлой попытки. Обновите страницу и оформите заказ заново.',
  [ApiErrorCodes.INSUFFICIENT_STOCK]: 'Столько товара нет в наличии. Уменьшите количество.',
  [ApiErrorCodes.INTERNAL_ERROR]: 'Сервер не смог обработать запрос. Повторите попытку.',
  [ApiErrorCodes.ORDER_ALREADY_PAID]: 'Заказ уже оплачен.',
  [ApiErrorCodes.ORDER_NOT_FOUND]: 'Заказ не найден.',
  [ApiErrorCodes.PAYMENT_FINALIZED]: 'Эта попытка оплаты уже завершена. Начните новую.',
  [ApiErrorCodes.PAYMENT_IN_PROGRESS]: 'Оплата этого заказа уже выполняется. Дождитесь результата.',
  [ApiErrorCodes.PAYMENT_NOT_REQUIRED]:
    'Этот заказ оплачивается при получении — онлайн-оплата не нужна.',
  [ApiErrorCodes.PRODUCT_NOT_FOUND]: 'Товар больше не доступен.',
  [ApiErrorCodes.QUOTE_EXPIRED]:
    'Расчёт устарел. Мы пересчитали стоимость — проверьте сумму и продолжите.',
  [ApiErrorCodes.QUOTE_NOT_FOUND]: 'Расчёт не найден. Обновите стоимость доставки.',
  [ApiErrorCodes.SESSION_INVALID]: 'Сессия истекла. Обновите страницу.',
  [ApiErrorCodes.SESSION_NOT_FOUND]: 'Сессия истекла. Обновите страницу.',
  [ApiErrorCodes.SESSION_REQUIRED]: 'Сессия истекла. Обновите страницу.',
  [ApiErrorCodes.VALIDATION_ERROR]: 'Проверьте заполнение полей формы.',
  [HttpErrorCodes.NETWORK]: HttpErrorMessage.network,
  [HttpErrorCodes.UNKNOWN]: HttpErrorMessage.unknown,
};

export const getErrorMessage = (error: unknown): string => {
  if (!(error instanceof HttpError)) {
    return HttpErrorMessage.unknown;
  }

  return MESSAGES[error.code] ?? error.message ?? HttpErrorMessage.unknown;
};

export const getIsErrorCode = (error: unknown, ...codes: ApiErrorCodes[]): boolean =>
  error instanceof HttpError && codes.includes(error.code as ApiErrorCodes);
