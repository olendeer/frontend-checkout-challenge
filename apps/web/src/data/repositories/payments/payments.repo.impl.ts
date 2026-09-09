import { HttpClient, RequestConfig } from 'core/http';
import { API } from 'data/endpoints';
import { Payment, Sandbox, Simulation } from 'domain/contracts';

import { PaymentsRepo, SimulationResult } from './payments.repo';
import { SimulatePaymentPayload } from './payments.repo.payload';

export class PaymentsRepoImpl implements PaymentsRepo {
  constructor(private readonly _http: HttpClient) {}

  getSandbox = async (config?: RequestConfig): Promise<Sandbox> => {
    const response = await this._http.get<Sandbox>(API.sandbox.toUrl(), config);

    return response.data;
  };

  createPayment = async (orderId: string, config: RequestConfig): Promise<Payment> => {
    const response = await this._http.post<Payment>(
      API.orders.payments.toUrl({ orderId }),
      {},
      config,
    );

    return response.data;
  };

  getPayment = async (paymentId: string, config?: RequestConfig): Promise<Payment> => {
    const response = await this._http.get<Payment>(API.payments.byId.toUrl({ paymentId }), config);

    return response.data;
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
