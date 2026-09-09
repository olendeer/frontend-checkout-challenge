import { RequestConfig } from 'core/http';
import { Payment, Sandbox, Scenario } from 'domain/contracts';

export interface PaymentService {
  getLatestPayment: (orderId: string, config?: RequestConfig) => Promise<Payment | null>;
  getPayment: (paymentId: string, config?: RequestConfig) => Promise<Payment>;
  getSandbox: (config?: RequestConfig) => Promise<Sandbox>;
  releaseAttempt: (orderId: string) => void;
  startPayment: (orderId: string, scenario: Scenario) => Promise<Payment>;
}
