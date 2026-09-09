import { Delivery } from 'domain/contracts';

export interface CreateQuotePayload {
  cartVersion: number;
  delivery: Delivery;
}
