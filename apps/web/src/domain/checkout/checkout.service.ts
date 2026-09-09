import { RequestConfig } from 'core/http';
import { CheckoutOptions, Delivery, Quote } from 'domain/contracts';

export interface CheckoutService {
  createQuote: (delivery: Delivery, config?: RequestConfig) => Promise<Quote>;
  getOptions: (config?: RequestConfig) => Promise<CheckoutOptions>;
}
