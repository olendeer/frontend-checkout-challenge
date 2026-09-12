import type { Static } from '@sinclair/typebox';
import type { CheckoutOptionsSchema, Quote as QuoteResponse } from '@checkout/contracts';

import { HttpClient, RequestConfig } from 'core/http';
import { CheckoutOptionsDto, QuoteDto } from 'data/dto/checkout';
import { API } from 'data/endpoints';
import { CheckoutOptions, Quote } from 'domain/checkout/entities';

import { CheckoutRepo } from './checkout.repo';
import { CreateQuotePayload } from './checkout.repo.payload';

export class CheckoutRepoImpl implements CheckoutRepo {
  constructor(private readonly _http: HttpClient) {}

  getOptions = async (config?: RequestConfig): Promise<CheckoutOptions> => {
    const response = await this._http.get<Static<typeof CheckoutOptionsSchema>>(
      API.checkoutOptions.toUrl(),
      config,
    );

    return CheckoutOptionsDto.mapToEntity(response.data);
  };

  createQuote = async (payload: CreateQuotePayload, config?: RequestConfig): Promise<Quote> => {
    const response = await this._http.post<QuoteResponse, CreateQuotePayload>(
      API.quotes.toUrl(),
      payload,
      config,
    );

    return QuoteDto.mapToEntity(response.data);
  };

  getQuote = async (quoteId: string, config?: RequestConfig): Promise<Quote> => {
    const response = await this._http.get<QuoteResponse>(
      API.quotes.byId.toUrl({ quoteId }),
      config,
    );

    return QuoteDto.mapToEntity(response.data);
  };
}
