import { RequestConfig } from 'core/http';
import { IdempotencyJournal } from 'core/idempotency';
import { OrdersRepo, PaymentsRepo } from 'data/repositories';
import { Scenario } from 'domain/contracts';
import { ApiErrorCodes, getIsErrorCode } from 'domain/errors';

import { Payment, Sandbox } from './entities';
import { PaymentService } from './payment.service';

export class PaymentServiceImpl implements PaymentService {
  constructor(
    private readonly _repo: PaymentsRepo,
    private readonly _ordersRepo: OrdersRepo,
    private readonly _journal: IdempotencyJournal,
  ) {}

  getSandbox = (config?: RequestConfig): Promise<Sandbox> => this._repo.getSandbox(config);

  getPayment = (paymentId: string, config?: RequestConfig): Promise<Payment> =>
    this._repo.getPayment(paymentId, config);

  getLatestPayment = async (orderId: string, config?: RequestConfig): Promise<Payment | null> => {
    const payments = await this._ordersRepo.getOrderPayments(orderId, config);

    return Payment.latest(payments);
  };

  startPayment = async (orderId: string, scenario: Scenario): Promise<Payment> => {
    const payment = await this._repo.createPayment(orderId, {
      idempotencyKey: this._journal.keyFor(this._getIntent(orderId), { orderId }),
    });

    await this._simulate(payment.id, scenario);

    return payment;
  };

  releaseAttempt = (orderId: string): void => this._journal.release(this._getIntent(orderId));

  private _simulate = async (paymentId: string, scenario: Scenario): Promise<void> => {
    try {
      await this._repo.simulate(paymentId, { scenario });
    } catch (error) {
      if (getIsErrorCode(error, ApiErrorCodes.PAYMENT_FINALIZED)) {
        return;
      }

      throw error;
    }
  };

  private _getIntent = (orderId: string): string => `payment:${orderId}`;
}
