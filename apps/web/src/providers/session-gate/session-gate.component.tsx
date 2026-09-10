'use client';

import { PropsWithChildren } from 'react';

import { getErrorMessage } from 'domain/errors';
import { useSessionQuery } from 'query/queries';
import { Alert, Button, Spinner } from 'ui-kit';

import styles from './session-gate.module.scss';

export const SessionGate = ({ children }: PropsWithChildren) => {
  const session = useSessionQuery();

  if (session.isPending) {
    return (
      <div className={styles.state}>
        <Spinner label="Подключаемся к магазину" />
        <p>Подключаемся к магазину…</p>
      </div>
    );
  }

  if (session.isError) {
    return (
      <div className={styles.state}>
        <Alert
          action={
            <Button onClick={() => session.refetch()} size="sm" variant="secondary">
              Повторить
            </Button>
          }
          title="Не удалось начать сессию"
        >
          {getErrorMessage(session.error)}
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
};
