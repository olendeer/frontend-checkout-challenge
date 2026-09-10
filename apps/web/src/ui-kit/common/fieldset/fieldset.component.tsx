import { ReactNode, useId } from 'react';

import styles from './fieldset.module.css';

interface FieldsetProps {
  children: ReactNode;
  error?: string;
  legend: string;
}

export const Fieldset = ({ children, error, legend }: FieldsetProps) => {
  const errorId = useId();

  return (
    <fieldset
      aria-describedby={error ? errorId : undefined}
      aria-invalid={error ? true : undefined}
      className={styles.fieldset}
    >
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.options}>{children}</div>
      {error ? (
        <span className={styles.error} id={errorId}>
          {error}
        </span>
      ) : null}
    </fieldset>
  );
};
