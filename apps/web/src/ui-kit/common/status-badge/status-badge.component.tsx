import { ReactNode } from 'react';

import styles from './status-badge.module.scss';

interface StatusBadgeProps {
  children: ReactNode;
  tone: 'neutral' | 'success' | 'warning' | 'danger';
}

export const StatusBadge = ({ children, tone }: StatusBadgeProps) => (
  <span className={[styles.badge, styles[tone]].join(' ')}>{children}</span>
);
