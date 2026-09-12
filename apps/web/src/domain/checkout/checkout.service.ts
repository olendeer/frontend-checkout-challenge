import { RequestConfig } from 'core/http';
import { Delivery } from 'domain/contracts';

import { CheckoutOptions, Quote } from './entities';

export interface CheckoutService {
  createQuote: (delivery: Delivery, config?: RequestConfig) => Promise<Quote>;
  getOptions: (config?: RequestConfig) => Promise<CheckoutOptions>;
}
