import Link from 'next/link';
import { ReactNode } from 'react';

import { ButtonAppearance, getButtonClassName } from '../button';

interface LinkButtonProps extends ButtonAppearance {
  children: ReactNode;
  href: string;
}

export const LinkButton = ({ children, href, ...appearance }: LinkButtonProps) => (
  <Link className={getButtonClassName(appearance)} href={href}>
    <span>{children}</span>
  </Link>
);
