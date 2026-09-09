'use client';

import { useState } from 'react';

import { getErrorMessage } from 'domain/errors';
import { Alert, Button, Fieldset, Modal, Money, RadioOption, Spinner } from 'ui-kit';
import { useSandboxQuery, useStartPaymentMutation } from 'query';

import styles from './payment-form.module.css';

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  total: number;
}

export const PaymentForm = ({ isOpen, onClose, orderId, total }: PaymentFormProps) => {
  const sandbox = useSandboxQuery(isOpen);
  const startPayment = useStartPaymentMutation(orderId);
  const [selectedCardId, setSelectedCardId] = useState('');

  const cards = sandbox.data?.cards ?? [];
  const selectedCard = cards.find((card) => card.id === selectedCardId) ?? cards[0];

  const pay = (): void => {
    if (!selectedCard) {
      return;
    }

    startPayment.mutate(selectedCard.scenario, { onSuccess: onClose });
  };

  const cancel = (): void => startPayment.mutate('cancel', { onSuccess: onClose });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Тестовая оплата">
      <p className={styles.amount}>
        К оплате:{' '}
        <strong>
          <Money value={total} />
        </strong>
      </p>
      <p className={styles.note}>
        Это учебная платёжная форма. Настоящий номер карты вводить не нужно — выберите тестовую
        карту из списка.
      </p>

      {startPayment.error ? (
        <Alert title="Оплата не запущена">{getErrorMessage(startPayment.error)}</Alert>
      ) : null}

      {sandbox.isPending ? (
        <p className={styles.note}>
          <Spinner label="Загружаем тестовые карты" /> Загружаем тестовые карты…
        </p>
      ) : null}

      {sandbox.isError ? (
        <Alert
          action={
            <Button onClick={() => sandbox.refetch()} size="sm" variant="secondary">
              Повторить
            </Button>
          }
          title="Карты не загрузились"
        >
          {getErrorMessage(sandbox.error)}
        </Alert>
      ) : null}

      {cards.length > 0 ? (
        <Fieldset legend="Тестовая карта">
          {cards.map((card) => (
            <RadioOption
              checked={selectedCard?.id === card.id}
              description={card.maskedNumber}
              key={card.id}
              label={card.title}
              name="test-card"
              onChange={() => setSelectedCardId(card.id)}
              value={card.id}
            />
          ))}
        </Fieldset>
      ) : null}

      <div className={styles.actions}>
        <Button disabled={!selectedCard} isLoading={startPayment.isPending} onClick={pay}>
          Оплатить
        </Button>
        <Button disabled={startPayment.isPending} onClick={cancel} variant="danger">
          Отменить оплату
        </Button>
        <Button disabled={startPayment.isPending} onClick={onClose} variant="ghost">
          Закрыть
        </Button>
      </div>
    </Modal>
  );
};
