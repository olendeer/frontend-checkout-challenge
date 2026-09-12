import { RequestConfig } from 'core/http';
import { CartRepo, CheckoutRepo } from 'data/repositories';
import { Delivery } from 'domain/contracts';
import { ApiErrorCodes, getIsErrorCode } from 'domain/errors';

import { CheckoutService } from './checkout.service';
import { CheckoutOptions, Quote } from './entities';

export class CheckoutServiceImpl implements CheckoutService {
  constructor(
    private readonly _repo: CheckoutRepo,
    private readonly _cartRepo: CartRepo,
  ) {}

  getOptions = (config?: RequestConfig): Promise<CheckoutOptions> => this._repo.getOptions(config);

  createQuote = async (delivery: Delivery, config?: RequestConfig): Promise<Quote> => {
    try {
      return await this._createForCurrentCart(delivery, config);
    } catch (error) {
      if (getIsErrorCode(error, ApiErrorCodes.CART_VERSION_CONFLICT)) {
        return await this._createForCurrentCart(delivery, config);
      }

      throw error;
    }
  };

  private _createForCurrentCart = async (
    delivery: Delivery,
    config?: RequestConfig,
  ): Promise<Quote> => {
    const cart = await this._cartRepo.getCart(config);

    const quote = await this._repo.createQuote({ cartVersion: cart.version, delivery }, config);

    return quote;
  };
}
