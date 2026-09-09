import Link from 'next/link';
import { ReactNode } from 'react';

import styles from './button.module.css';

interface LinkButtonProps {
  children: ReactNode;
  href: string;
  isFullWidth?: boolean;
  size?: 'md' | 'sm';
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

export const LinkButton = ({
  children,
  href,
  isFullWidth,
  size = 'md',
  variant = 'primary',
}: LinkButtonProps) => (
  <Link
    className={[styles.button, styles[variant], styles[size], isFullWidth ? styles.fullWidth : '']
      .filter(Boolean)
      .join(' ')}
    href={href}
  >
    <span>{children}</span>
  </Link>
);
