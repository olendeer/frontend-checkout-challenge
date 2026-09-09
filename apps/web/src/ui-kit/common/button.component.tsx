import { ButtonHTMLAttributes } from 'react';

import { Spinner } from './spinner.component';
import styles from './button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isFullWidth?: boolean;
  isLoading?: boolean;
  size?: 'md' | 'sm';
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

export const Button = ({
  children,
  className,
  disabled,
  isFullWidth,
  isLoading,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...rest
}: ButtonProps) => (
  <button
    {...rest}
    aria-busy={isLoading || undefined}
    className={[
      styles.button,
      styles[variant],
      styles[size],
      isFullWidth ? styles.fullWidth : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ')}
    disabled={disabled || isLoading}
    type={type}
  >
    {isLoading ? <Spinner /> : null}
    <span>{children}</span>
  </button>
);
