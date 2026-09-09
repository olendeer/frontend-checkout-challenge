import { RequestConfig } from 'core/http';
import { Cart, CartItem } from 'domain/contracts';

import { SetCartItemPayload } from './cart.repo.payload';

export interface CartRepo {
  deleteItem: (productId: string, config?: RequestConfig) => Promise<void>;
  getCart: (config?: RequestConfig) => Promise<Cart>;
  setItem: (
    productId: string,
    payload: SetCartItemPayload,
    config?: RequestConfig,
  ) => Promise<CartItem>;
}
