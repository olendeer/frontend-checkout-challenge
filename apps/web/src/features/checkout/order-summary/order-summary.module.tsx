import { UseQueryResult } from '@tanstack/react-query';

import { Quote } from 'domain/checkout';
import { getErrorMessage } from 'domain/errors';
import { Alert, Button, Card, Money, Spinner } from 'ui-kit';

import styles from './order-summary.module.scss';

interface OrderSummaryProps {
  isSubmitting: boolean;
  quote: UseQueryResult<Quote>;
  submitLabel: string;
}

export const OrderSummary = ({ isSubmitting, quote, submitLabel }: OrderSummaryProps) => (
  <Card className={styles.summary}>
    <h2 className={styles.heading}>Итого</h2>

    {quote.isError ? (
      <Alert
        action={
          <Button onClick={() => quote.refetch()} size="sm" variant="secondary">
            Пересчитать
          </Button>
        }
        title="Не удалось рассчитать доставку"
      >
        {getErrorMessage(quote.error)}
      </Alert>
    ) : null}

    <dl aria-busy={quote.isFetching} className={styles.rows}>
      <div className={styles.row}>
        <dt>Товары</dt>
        <dd data-testid="summary-subtotal">
          {quote.data ? <Money value={quote.data.subtotal} /> : '—'}
        </dd>
      </div>
      <div className={styles.row}>
        <dt>Доставка</dt>
        <dd data-testid="summary-shipping">
          {quote.data ? <Money value={quote.data.shipping} /> : '—'}
        </dd>
      </div>
      <div className={[styles.row, styles.total].join(' ')}>
        <dt>К оплате</dt>
        <dd data-testid="summary-total">{quote.data ? <Money value={quote.data.total} /> : '—'}</dd>
      </div>
    </dl>

    <p aria-live="polite" className={styles.status}>
      {quote.isFetching ? (
        <>
          <Spinner label="Пересчитываем стоимость" /> Пересчитываем стоимость…
        </>
      ) : null}
      {!quote.isFetching && !quote.data && !quote.isError
        ? 'Заполните способ доставки, чтобы увидеть итоговую сумму.'
        : null}
    </p>

    <Button disabled={!quote.data} isFullWidth isLoading={isSubmitting} type="submit">
      {submitLabel}
    </Button>
  </Card>
);
