import { RequestConfig } from 'core/http';
import { CheckoutOptions, Quote } from 'domain/contracts';

import { CreateQuotePayload } from './checkout.repo.payload';

export interface CheckoutRepo {
  createQuote: (payload: CreateQuotePayload, config?: RequestConfig) => Promise<Quote>;
  getOptions: (config?: RequestConfig) => Promise<CheckoutOptions>;
  getQuote: (quoteId: string, config?: RequestConfig) => Promise<Quote>;
}
