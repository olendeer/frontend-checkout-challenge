import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

import styles from './radio-option.module.scss';

interface RadioOptionProps extends InputHTMLAttributes<HTMLInputElement> {
  description?: ReactNode;
  label: ReactNode;
}

export const RadioOption = forwardRef<HTMLInputElement, RadioOptionProps>(function RadioOption(
  { description, label, ...rest },
  ref,
) {
  return (
    <label className={styles.option}>
      <input {...rest} className={styles.input} ref={ref} type="radio" />
      <span className={styles.body}>
        <span className={styles.label}>{label}</span>
        {description ? <span className={styles.description}>{description}</span> : null}
      </span>
    </label>
  );
});
