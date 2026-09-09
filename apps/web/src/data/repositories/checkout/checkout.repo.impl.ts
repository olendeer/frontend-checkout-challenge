import { HttpClient, RequestConfig } from 'core/http';
import { API } from 'data/endpoints';
import { CheckoutOptions, Quote } from 'domain/contracts';

import { CheckoutRepo } from './checkout.repo';
import { CreateQuotePayload } from './checkout.repo.payload';

export class CheckoutRepoImpl implements CheckoutRepo {
  constructor(private readonly _http: HttpClient) {}

  getOptions = async (config?: RequestConfig): Promise<CheckoutOptions> => {
    const response = await this._http.get<CheckoutOptions>(API.checkoutOptions.toUrl(), config);

    return response.data;
  };

  createQuote = async (payload: CreateQuotePayload, config?: RequestConfig): Promise<Quote> => {
    const response = await this._http.post<Quote, CreateQuotePayload>(
      API.quotes.toUrl(),
      payload,
      config,
    );

    return response.data;
  };

  getQuote = async (quoteId: string, config?: RequestConfig): Promise<Quote> => {
    const response = await this._http.get<Quote>(API.quotes.byId.toUrl({ quoteId }), config);

    return response.data;
  };
}
