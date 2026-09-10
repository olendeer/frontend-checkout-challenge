import { forwardRef, InputHTMLAttributes, useId } from 'react';

import styles from './text-field.module.css';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  hint?: string;
  label: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { error, hint, label, ...rest },
  ref,
) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ');

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        {...rest}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : undefined}
        className={[styles.input, error ? styles.invalid : ''].filter(Boolean).join(' ')}
        id={id}
        ref={ref}
      />
      {hint ? (
        <span className={styles.hint} id={hintId}>
          {hint}
        </span>
      ) : null}
      {error ? (
        <span className={styles.error} id={errorId}>
          {error}
        </span>
      ) : null}
    </div>
  );
});
