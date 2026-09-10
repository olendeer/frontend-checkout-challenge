import { formatMoney } from 'domain/money';

interface MoneyProps {
  value: number;
}

export const Money = ({ value }: MoneyProps) => <>{formatMoney(value)}</>;
