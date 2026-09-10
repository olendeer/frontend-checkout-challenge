import { ElementType, ReactNode } from 'react';

import styles from './card.module.scss';

interface CardProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
}

export const Card = ({ as: Tag = 'div', children, className }: CardProps) => (
  <Tag className={[styles.card, className ?? ''].filter(Boolean).join(' ')}>{children}</Tag>
);
