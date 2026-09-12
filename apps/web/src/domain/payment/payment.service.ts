import { RequestConfig } from 'core/http';
import { Scenario } from 'domain/contracts';

import { Payment, Sandbox } from './entities';

export interface PaymentService {
  getLatestPayment: (orderId: string, config?: RequestConfig) => Promise<Payment | null>;
  getPayment: (paymentId: string, config?: RequestConfig) => Promise<Payment>;
  getSandbox: (config?: RequestConfig) => Promise<Sandbox>;
  releaseAttempt: (orderId: string) => void;
  startPayment: (orderId: string, scenario: Scenario) => Promise<Payment>;
}
