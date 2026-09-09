import { RequestConfig } from 'core/http';
import { Payment, Sandbox, Simulation } from 'domain/contracts';

import { SimulatePaymentPayload } from './payments.repo.payload';

export interface SimulationResult {
  retryAfterMs: number | null;
  simulation: Simulation;
}

export interface PaymentsRepo {
  createPayment: (orderId: string, config: RequestConfig) => Promise<Payment>;
  getPayment: (paymentId: string, config?: RequestConfig) => Promise<Payment>;
  getSandbox: (config?: RequestConfig) => Promise<Sandbox>;
  simulate: (
    paymentId: string,
    payload: SimulatePaymentPayload,
    config?: RequestConfig,
  ) => Promise<SimulationResult>;
}
