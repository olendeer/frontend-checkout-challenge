import type { Static } from '@sinclair/typebox';
import type { Payment as PaymentResponse, SandboxSchema, Simulation } from '@checkout/contracts';

import { HttpClient, RequestConfig } from 'core/http';
import { PaymentDto, SandboxDto } from 'data/dto/payment';
import { API } from 'data/endpoints';
import { Payment, Sandbox } from 'domain/payment/entities';

import { PaymentsRepo, SimulationResult } from './payments.repo';
import { SimulatePaymentPayload } from './payments.repo.payload';

export class PaymentsRepoImpl implements PaymentsRepo {
  constructor(private readonly _http: HttpClient) {}

  getSandbox = async (config?: RequestConfig): Promise<Sandbox> => {
    const response = await this._http.get<Static<typeof SandboxSchema>>(
      API.sandbox.toUrl(),
      config,
    );

    return SandboxDto.mapToEntity(response.data);
  };

  createPayment = async (orderId: string, config: RequestConfig): Promise<Payment> => {
    const response = await this._http.post<PaymentResponse>(
      API.orders.payments.toUrl({ orderId }),
      {},
      config,
    );

    return PaymentDto.mapToEntity(response.data);
  };

  getPayment = async (paymentId: string, config?: RequestConfig): Promise<Payment> => {
    const response = await this._http.get<PaymentResponse>(
      API.payments.byId.toUrl({ paymentId }),
      config,
    );

    return PaymentDto.mapToEntity(response.data);
  };

  simulate = async (
    paymentId: string,
    payload: SimulatePaymentPayload,
    config?: RequestConfig,
  ): Promise<SimulationResult> => {
    const response = await this._http.post<Simulation, SimulatePaymentPayload>(
      API.payments.simulations.toUrl({ paymentId }),
      payload,
      config,
    );

    return { retryAfterMs: response.retryAfterMs, simulation: response.data };
  };
}
